import {type ChangeEvent, useContext, useMemo, useState} from "react";
import {FireContext} from "../Context.tsx";
import {addTaskToUser, deleteUserTask, getUserTasks, updateUserTask} from "../services/firebase.ts";
import {
    BTN_VARIANT,
    TASK_PRIORITY,
    TASK_STATUS,
    type ConfirmDialog,
    type SortArrayConfig,
    type TaskData, type FilterConfig
} from "../types/types.ts";
import Task from "./Task.tsx";
import Modal from "./Modal.tsx";
import TaskEditor from "./TaskEditor.tsx";
import {filterArray} from "../utils/filter.ts";
import {moveItem, sortArray} from "../utils/sort.ts";
import {searchInArray} from "../utils/search.ts";
import {useNavigate} from "react-router";
import {CUSTOM_SORT_STEP, SORT_DIRECTION, SORT_METHOD} from "../constants/sortConstants.ts";
import Filters from "./Filters.tsx";

function Tasks({setConfirmDialog}: { setConfirmDialog: (actions: ConfirmDialog | null) => void }) {
    const {user} = useContext(FireContext)
    const navigate = useNavigate();
    if (!user) {
        navigate("/login", {replace: true});
        return
    }
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [tasks, setTasks] = useState<TaskData[] | []>([]);
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig<TaskData>[]>([]);
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "id",
        direction: SORT_DIRECTION.ASC,
        sortMethod: SORT_METHOD.ALPHABETICAL,
    });
    const processedTasks = useMemo(() => {
        if (tasks && Object.entries(filtersConfig).length > 0) {
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
    const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
        const logicalOrder = () => {
            switch (event.target.value) {
                case "priority":
                    return [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH]
                case "status":
                    return [TASK_STATUS.IDLE, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED, TASK_STATUS.OVERDUE]
            }
        }
        const sortingMethod = () => {
            switch (event.target.value) {
                case "priority":
                case "status":
                    return SORT_METHOD.LOGICAL
                case "createdAt":
                case "dueDate":
                case "customOrder":
                    return SORT_METHOD.NUMERICAL
                default:
                    return SORT_METHOD.ALPHABETICAL
            }
        }
        setSortConfig({
            key: event.target.value as keyof TaskData,
            direction: SORT_DIRECTION.ASC,
            sortMethod: sortingMethod(),
            logicOrder: logicalOrder()
        })
    }

    const handleCreate = () => {
        setEditTask(undefined)
        setIsEditorOpen(true);
    }
    const handleEdit = (task: TaskData) => {
        setEditTask(task);
        setIsEditorOpen(true);
    }
    const confirmDelete = (task: TaskData) => {
        setConfirmDialog(
            {
                title: "Delete Task",
                text: "Are you sure you want to delete this task?",
                confirmText: "Delete",
                btnVariant: BTN_VARIANT.DANGER,
                onConfirm: () => {
                    deleteHandler(task).then(() => setConfirmDialog(null));
                },
                onCancel: () => {
                    setConfirmDialog(null)
                }
            }
        )
    }

    async function getHandler() {
        if (user?.uid) {
            const tasks = await getUserTasks(user.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            } else {
                setTasks([])
            }
        }
        return
    }

    function getNextOrder(): number {
        if (tasks?.length === 0) return CUSTOM_SORT_STEP;
        return Math.max(...tasks.map(t => t.customOrder!)) + CUSTOM_SORT_STEP
    }

    async function addHandler(task: TaskData) {
        if (user?.uid) {
            await addTaskToUser(user.uid, {...task, createdAt: Date.now(), customOrder: getNextOrder()})
            await getHandler()
            setIsEditorOpen(false)
        }
        setIsEditorOpen(false)
        return
    }

    async function deleteHandler(task: TaskData) {
        if (user?.uid) {
            await deleteUserTask(user.uid, task.id!)
            await getHandler()
        }
        return
    }

    async function updateHandler(task: TaskData, updatedTask: TaskData) {
        if (user?.uid) {
            await updateUserTask(user.uid, task.id!, updatedTask)
            await getHandler()
        }
        setIsEditorOpen(false)
        return
    }

    async function moveTaskHandler(task: TaskData, index: number, moveTo: "up" | "down") {
        setSortConfig({...sortConfig, key: "customOrder", sortMethod: SORT_METHOD.NUMERICAL})
        const newOrder = moveItem(processedTasks, index, moveTo, sortConfig.direction)
        if (!newOrder) return
        await updateHandler(task, {...task, customOrder: newOrder})
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
            <Filters setFiltersConfig={setFiltersConfig} filtersConfig={filtersConfig}/>
            <input onChange={event => setSearch(event.target.value)} placeholder="search"
                   className="border-2 border-blue-600 rounded-md px-2 w-md text-2xl p-2.5"/>
            <div className="flex justify-between items-center w-2xl">
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={handleCreate}>
                    CREATE NEW TASK
                </button>
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={getHandler}>
                    TEST get tasks
                </button>
            </div>
            <div className="flex justify-between items-center ">
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={() => setFiltersConfig([])}>
                    Clear filters
                </button>
                <select name="sort" value={sortConfig.key}
                        onChange={handleSorting}>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Creation time</option>
                    <option value="customOrder">Custom order</option>
                </select>
                <button onClick={() => setSortConfig(prevState => {
                    return {
                        ...prevState,
                        direction: prevState.direction === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                    }
                })}>switch sort direction
                </button>
            </div>
            {processedTasks && processedTasks.length > 0 ? <div className="flex gap-5 flex-wrap">
                {processedTasks.map((task) => (
                    <Task canManuallySort={sortConfig.key === "customOrder"} task={task} tasks={processedTasks}
                          onComplete={(task) => updateHandler(task, task)} onDelete={confirmDelete}
                          onEdit={handleEdit} key={task.id} onMove={moveTaskHandler}/>
                ))}
            </div> : <div className="mt-36 flex flex-col items-center text-2xl">You currently have no tasks</div>}
            {isEditorOpen && <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
              <TaskEditor onCreate={addHandler} onEdit={updateHandler}
                          onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>}
        </div>
    );
}

export default Tasks;