import type {TaskData} from "../types/types.ts";
import type {User} from "firebase/auth";
import {useState} from "react";
import Modal from "./Modal.tsx";

interface Props {
    task: TaskData,
    user: User | null,
    onDelete: (user: User | null, task: TaskData) => Promise<void>,
    onEdit: (user: User | null, task: TaskData, updatedTask: TaskData) => Promise<void>,
}
// type EditedTask = Partial<TaskData>

const Task = ({task, user, onDelete, onEdit}: Props) => {
    const [showModal, setShowModal] = useState(false);
    // const [editedTask, setEditedTask] = useState<EditedTask | null>(null);
    function openDialog() {
        setShowModal(true);
    }
    function closeDialog() {
        setShowModal(false);
    }

    return (
        <div className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md">
            <p>ID: {task.id}</p>
            <p>Tittle: {task.tittle}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <div className="flex justify-between items-center">
                <button onClick={() => onEdit(user, task, {} as TaskData)}
                    className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Edit
                </button>
                <button onClick={openDialog}
                        className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Delete
                </button>
            </div>
            <Modal isOpen={showModal} onClose={closeDialog}>
                    <div className="flex flex-col gap-2.5 justify-center items-center p-5">
                        <p>Confirm delete?</p>
                        <div className="flex justify-between items-center w-full gap-5">
                            <button onClick={() => onDelete(user, task)} className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Confirm</button>
                            <button onClick={closeDialog} className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Go back</button>
                        </div>
                    </div>
            </Modal>
        </div>
    );
};

export default Task;