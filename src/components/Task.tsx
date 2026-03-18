import type {TaskData} from "../types/types.ts";

interface Props {
    task: TaskData,
    tasks: TaskData[] | null,
    onComplete: (task: TaskData) => void,
    onDelete: (task: TaskData) => void,
    onEdit: (task: TaskData) => void,
    onMove: (task: TaskData, index: number, direction: "up" | "down") => void,
    canManuallySort: boolean,
}

const Task = ({task, tasks, onComplete, onDelete, onEdit, onMove, canManuallySort}: Props) => {
    console.log("task render")
    if (!tasks) return
    return (
        <div
            className={"flex flex-col gap-2.5 border-2 text-2xl font-bold p-2.5 rounded-md" + ` ${task.status === "completed" ? "border-green-600" : task.status === "overdue" ? "border-red-600" : "border-blue-600"}`}>
            <p>ID: {task.id}</p>
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Created at: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}</p>
            <p>Custom order: {task.customOrder || "-"}</p>
            {task.dueDate && <p>Deadline: {new Date(task.dueDate).toLocaleString()}</p>}
            <div className="flex justify-between items-center">
                <button onClick={() => onEdit(task)}
                        className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Edit
                </button>
                <button onClick={() => onDelete(task)}
                        className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Delete
                </button>
            </div>
            <button onClick={() => onComplete({...task, status: "completed"})}
                    className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Mark as
                completed
            </button>
            {canManuallySort && <div>
              <button disabled={!canManuallySort}
                      onClick={() => onMove(task, tasks.findIndex(t => t.id === task.id), "up")}
                      className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">up
              </button>
              <button disabled={!canManuallySort}
                      onClick={() => onMove(task, tasks.findIndex(t => t.id === task.id), "down")}
                      className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">down
              </button>
            </div>}
        </div>
    );
};

export default Task;