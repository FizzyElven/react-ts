import type {TaskData} from "../types/types.ts";

interface Props {
    task: TaskData,
    tasks: TaskData[] | null,
    onDelete: (task: TaskData) => void,
    onEdit: (task: TaskData) => void,
    onMove: (task: TaskData, index: number, direction: "up" | "down") => void,
    canManuallySort: boolean,
}

const Task = ({task, tasks, onDelete, onEdit, onMove, canManuallySort}: Props) => {
    console.log("task render")
    if (!tasks) return
    return (
        <div className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md">
            <p>ID: {task.id}</p>
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Created at: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}</p>
            <p>Custom order: {task.customOrder || "-"}</p>
            <div className="flex justify-between items-center">
                <button onClick={() => onEdit(task)}
                        className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Edit
                </button>
                <button onClick={() => onDelete(task)}
                        className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Delete
                </button>
            </div>
            <div>
                <button disabled={!canManuallySort} onClick={()=>onMove(task, tasks.findIndex(t => t.id === task.id), "up")}
                    className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">up
                </button>
                <button disabled={!canManuallySort} onClick={()=>onMove(task, tasks.findIndex(t => t.id === task.id), "down")}
                    className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">down
                </button>
            </div>
        </div>
    );
};

export default Task;