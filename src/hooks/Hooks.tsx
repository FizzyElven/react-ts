import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User} from "firebase/auth";
import {useCallback, useEffect, useMemo, useState} from "react";
import {type FilterConfig, FILTERS, type FilterType, type SortArrayConfig, type TaskData} from "../types/types.ts";
import {getNextOrder, moveItem, sortArray} from "../utils/sort.ts";
import type {TaskService} from "../services/TaskService.ts";
import {filterArray} from "../utils/filter.ts";
import {searchInArray} from "../utils/search.ts";
import {firebaseApp} from "../services/firebase.ts";
import {useNavigate} from "react-router";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    const login = async () => {

        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
        if (auth.currentUser) {
            setUser(auth.currentUser);
            navigate("tasks", {replace: true});
        }
    }
    const logout = async () => {
        await signOut(auth)
        setUser(null);
        if (!auth.currentUser) {
            navigate("login", {replace: true});
        }
    }
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return {user, loading, login, logout, auth};
};

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
    const fetchTasks = useCallback(
        async () => {
            if (!user?.uid) return
            setIsLoading(true);
            try {
                const data = await taskService.getUserTasks(user.uid);
                setTasks(data || []);
            } finally {
                setIsLoading(false);
            }
        }, []
    )
    const addTask = async (task: TaskData) => {
        if (!user?.uid) return;
        await taskService.addTaskToUser(user.uid, {
            ...task,
            createdAt: Date.now(),
            customOrder: getNextOrder(tasks)
        });
        await fetchTasks(); // Refresh list
        setIsEditorOpen(false);
    };
    const deleteTask = async (taskId: string) => {
        if (!user?.uid) return;
        await taskService.deleteUserTask(user.uid, taskId);
        await fetchTasks();
    };
    const updateTask = async (taskId: string, updatedData: Partial<TaskData>) => {
        if (!user?.uid) return;
        await taskService.updateUserTask(user.uid, taskId, updatedData);
        await fetchTasks();
        setIsEditorOpen(false);
    };
    async function moveTask(task: TaskData, index: number, moveTo: "up" | "down") {
        const newOrder = moveItem(processedTasks, index, moveTo, sortConfig.direction)
        if (!newOrder) return
        await updateTask(task.id!, {...task, customOrder: newOrder})
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