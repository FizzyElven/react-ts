import type {TaskData} from "../types/types.ts";
import type {User} from "firebase/auth";

interface Props {
    task: TaskData,
    user: User | null,
    onDelete: (user: User | null, task: TaskData) => void,
    onEdit: (task: TaskData)=>void,
}

const Task = ({task, user, onDelete, onEdit}: Props) => {
    console.log("task render")

    return (
        <div className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md">
            <p>ID: {task.id}</p>
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Created at: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}</p>
            <div className="flex justify-between items-center">
                <button onClick={()=>onEdit(task)}
                    className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Edit
                </button>
                <button onClick={()=> onDelete(user, task)}
                        className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Delete
                </button>
            </div>
        </div>
    );
};

export default Task;