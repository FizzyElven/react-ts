import {type ChangeEvent, useContext, useMemo, useState} from "react";
import {FireContext} from "../Context.tsx";
import {addTaskToUser, deleteUserTask, getUserTasks, updateUserTask} from "../services/firebase.ts";
import type {ConfirmDialog, SortArrayConfig, TaskData} from "../types/types.ts";
import Task from "./Task.tsx";
import type {User} from "firebase/auth";
import Modal from "./Modal.tsx";
import TaskEditor from "./TaskEditor.tsx";
import {filterArray} from "../utils/filter.ts";
import {sortArray} from "../utils/sort.ts";

function Tasks({setConfirmDialog}: { setConfirmDialog: (actions: ConfirmDialog | null) => void }) {
    const {user} = useContext(FireContext)
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [tasks, setTasks] = useState<TaskData[] | null>(null);
    const [filters, setFilters] = useState<Partial<TaskData>>({});
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "id",
        direction: "asc",
        sortMethod: "alphabetical"
    });
    const processedTasks = useMemo(() => {
        if (tasks) {
            const filteredTasks = filterArray(tasks, filters)
            return sortArray(filteredTasks, sortConfig)
        }
        return 0
    }, [tasks, filters, sortConfig]);
    const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
        const logicalOrder = () => {
            switch (event.target.value) {
                case "priority":
                    return ["low", "medium", "high"]
                case "status":
                    return ["idle", "in progress", "completed"]
            }
        }
        const sortingMethod = () => {
            switch (event.target.value) {
                case "priority":
                case "status":
                    return "logical"
                case "createdAt":
                    return "numerical"
                default:
                    return "alphabetical"
            }
        }
        setSortConfig({
            key: event.target.value as keyof TaskData,
            direction: "asc",
            sortMethod: sortingMethod(),
            logicOrder: logicalOrder()
        })
    }

    function updateFilters(field: keyof TaskData, value: any) {
        setFilters(filters => ({
            ...filters,
            [field]: value
        }))
        console.log(filters)
    }

    const handleCreate = () => {
        setEditTask(undefined)
        setIsEditorOpen(true);
    }
    const handleEdit = (task: TaskData) => {
        setEditTask(task);
        setIsEditorOpen(true);
    }
    const confirmDelete = (user: User | null, task: TaskData) => {
        setConfirmDialog(
            {
                title: "Delete Task",
                text: "Are you sure you want to delete this task?",
                confirmText: "Delete",
                btnVariant: "danger",
                onConfirm: () => {
                    deleteHandler(user, task);
                    setConfirmDialog(null);
                },
                onCancel: () => {
                    setConfirmDialog(null)
                }
            }
        )
    }

    async function getHandler() {
        if (user && user.uid) {
            const tasks = await getUserTasks(user?.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            } else {
                setTasks(null)
            }
        }
        return
    }

    async function addHandler(user: User | null, task: TaskData) {
        if (user && user.uid) {
            await addTaskToUser(user?.uid, {...task, createdAt: Date.now()})
            await getHandler()
            setIsEditorOpen(false)
        }
        setIsEditorOpen(false)
        return
    }

    async function deleteHandler(user: User | null, task: TaskData) {
        if (user && user.uid) {
            await deleteUserTask(user.uid, task.id!)
            await getHandler()
        }
        return
    }

    async function updateHandler(user: User | null, task: TaskData, updatedTask: TaskData) {
        if (user && user.uid) {
            await updateUserTask(user.uid, task.id!, updatedTask)
            await getHandler()
        }
        setIsEditorOpen(false)
        return
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
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
                        onClick={() => updateFilters("priority", "high")}>
                    Filter test priority
                </button>
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={() => updateFilters("status", "completed")}>
                    Filter test status
                </button>
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={() => setFilters({})}>
                    Clear filters
                </button>
                <select name="sort" value={sortConfig.key}
                        onChange={handleSorting}>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Creation time</option>
                </select>
                <button onClick={() => setSortConfig(prevState => {
                    return {...prevState,
                    direction: prevState.direction === "asc" ? "desc" : "asc",
                    }
                })}>switch sort direction</button>
            </div>
            {processedTasks && processedTasks.length > 0 ? <div>
                {processedTasks.map((task) => (
                    <Task user={user} task={task} onDelete={confirmDelete} onEdit={handleEdit} key={task.id}/>
                ))}
            </div> : <div className="mt-36 flex flex-col items-center text-2xl">You currently have no tasks</div>}
            {isEditorOpen && <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
              <TaskEditor user={user} onCreate={addHandler} onEdit={updateHandler}
                          onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>}
        </div>
    );
}

export default Tasks;