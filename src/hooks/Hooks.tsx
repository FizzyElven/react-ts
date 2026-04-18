import {type User} from "firebase/auth";
import {useCallback, useEffect, useMemo, useState} from "react";
import {
    type FilterConfig,
    FILTERS,
    type FilterType,
    type SortArrayConfig,
    TASK_PRIORITY, TASK_STATUS,
    type TaskData, type TasksError
} from "../types/types.ts";
import {getNextOrder, moveItem, sortArray} from "../utils/sort.ts";
import type {TaskService} from "../services/TaskService.ts";
import {filterArray} from "../utils/filter.ts";
import {searchInArray} from "../utils/search.ts";
import {getTaskStatus} from "../utils/taskHelpers.ts";

interface UseTasksProps {
    user: User;
    taskService: TaskService;
    filtersConfig: FilterConfig<TaskData>[];
    search: string;
    sortConfig: SortArrayConfig<TaskData>;
}

export const useTasks = ({user, taskService, filtersConfig, search, sortConfig}: UseTasksProps) => {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<TasksError | null>(null);
    useEffect(() => {
        setError(null);
    }, [isEditorOpen]);
    const fetchTasks = useCallback(
        async () => {
            if (!user?.uid) return
            setError(null);
            setIsLoading(true);
            try {
                const data = await taskService.getUserTasks(user.uid);
                const processedData = data.map(task => getTaskStatus(task))
                setTasks(processedData || []);
            } catch (e) {
                if (e instanceof Error) setError({message: e.message, errorScope: "get"});
                console.log(e)
            } finally {
                setIsLoading(false);
            }
        }, []
    )
    const addTask = async (task: TaskData) => {
        if (!user?.uid) return;
        setError(null);
        try {
            await taskService.addTaskToUser(user.uid, {
                ...task,
                createdAt: Date.now(),
                customOrder: getNextOrder(tasks)
            })
            await fetchTasks()
            setIsEditorOpen(false);
        } catch (e) {
            if (e instanceof Error) setError({message: e.message, errorScope: "add"});
            console.log(e)
        }
    };
    const deleteTask = async (taskId: string) => {
        if (!user?.uid) return;
        setError(null);
        await taskService.deleteUserTask(user.uid, taskId);
        await fetchTasks();
    };
    const updateTask = async (taskId: string, updatedData: Partial<TaskData>) => {
        if (!user?.uid) return;
        setError(null);
        try {
            await taskService.updateUserTask(user.uid, taskId, updatedData);
            await fetchTasks();
            setIsEditorOpen(false);
        } catch (e) {
            if (e instanceof Error) setError({message: e.message, errorScope: "update", taskId: taskId});
            console.log(e)
            throw new Error("failed to update task");
        }
    };

    async function moveTask(task: TaskData, moveTo?: "up" | "down", targetId?: string,) {
        setError(null);
        const newOrder = moveItem({
            arr: processedTasks,
            currentId: task.id,
            direction: sortConfig.direction,
            targetId,
            moveDirection: moveTo
        })
        if (!newOrder) return
        try {
            await taskService.updateUserTask(user.uid, task.id!, {...task, customOrder: newOrder})
            await fetchTasks();
        } catch (e) {
            if (e instanceof Error) setError({message: e.message, errorScope: "move", taskId: task.id});
            console.log(e)
        }
    }

    const processedTasks = useMemo(() => {
        if (tasks && filtersConfig.length > 0) {
            const filteredTasks = filterArray(tasks, filtersConfig)
            if (!search) {
                return sortArray(filteredTasks, sortConfig)
            }
            const searchedTasks = searchInArray(filteredTasks, search, ["title", "description"]);
            return sortArray(searchedTasks, sortConfig)
        } else if (tasks) {
            if (!search) {
                return sortArray(tasks, sortConfig)
            }
            const searchedTasks = searchInArray(tasks, search, ["title", "description"]);
            return sortArray(searchedTasks, sortConfig)
        }
        return null
    }, [tasks, filtersConfig, sortConfig, search]);
    const handleCreateTask = () => {
        setEditTask(undefined)
        setIsEditorOpen(true);
    }
    const handleEditTask = (task: TaskData) => {
        setEditTask(task);
        setIsEditorOpen(true);
    }
    return {
        tasks,
        setTasks,
        isLoading,
        isEditorOpen,
        setIsEditorOpen,
        fetchTasks,
        addTask,
        deleteTask,
        updateTask,
        moveTask,
        processedTasks,
        handleCreateTask,
        handleEditTask,
        editTask,
        error,
    };
}

export const useFilters = () => {
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig<TaskData>[]>([]);

    function addFilter(field: FilterType, value: string) {
        if (field === FILTERS.OTHER) {
            setFiltersConfig([
                ...filtersConfig,
                {
                    field,
                    value,
                },
            ])
        }
        const arr = filtersConfig.filter(el => el.field !== field)
        setFiltersConfig([...arr, {field, value}])
    }

    function removeFilter(field: keyof TaskData, value: any) {
        setFiltersConfig(filtersConfig.filter(el => el.field !== field && el.value !== value));
    }

    return {removeFilter, addFilter, filtersConfig, setFiltersConfig};
}

export const useTaskEditor = (initialTask: TaskData | undefined) => {
    const [editedTask, setEditedTask] = useState<TaskData>(initialTask ? initialTask : {
        id: "0000",
        title: "",
        description: "",
        priority: TASK_PRIORITY.LOW,
        status: TASK_STATUS.IDLE,
        customOrder: 0,
    });

    function updateField(field: keyof TaskData, value: any) {
        setEditedTask(task => ({
            ...task,
            [field]: value
        }))
    }

    function toggleOptionalProps(prop: keyof TaskData, value?: any) {
        if (editedTask[prop]) {
            setEditedTask({...editedTask, [prop]: null});
            return;
        } else {
            setEditedTask({...editedTask, [prop]: value});
            return;
        }
    }

    return {updateField, toggleOptionalProps, editedTask}
}