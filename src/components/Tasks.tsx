import {useContext, useState} from "react";
import {FireContext} from "../Context.tsx";
import {addTaskToUser, deleteUserTask, getUserTasks, updateUserTask} from "../services/firebase.ts";
import type {ConfirmDialog, TaskData} from "../types/types.ts";
import Task from "./Task.tsx";
import type {User} from "firebase/auth";
import Modal from "./Modal.tsx";
import TaskEditor from "./TaskEditor.tsx";

function Tasks({setConfirmDialog} : {setConfirmDialog :(actions: ConfirmDialog | null) => void}) {
    const {user} = useContext(FireContext)
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [tasks, setTasks] = useState<TaskData[] | null>(null);
    console.log(`Tasks render ${user?.uid}`)
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
                onCancel: () => {setConfirmDialog(null)}
            }
        )
    }

    async function addHandler(user: User | null, task: TaskData) {
        if (user && user.uid) {
            await addTaskToUser(user?.uid, task)
            const tasks = await getUserTasks(user?.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            }
            setIsEditorOpen(false)
        }
        setIsEditorOpen(false)
        return
    }

    async function getHandler() {
        if (user && user.uid) {
            const tasks = await getUserTasks(user?.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            }
        }
        return
    }

    async function deleteHandler(user: User | null, task: TaskData) {

        if (user && user.uid) {
            await deleteUserTask(user.uid, task.id!)
            const tasks = await getUserTasks(user.uid)
            console.log(tasks)
            if (tasks) {
                setTasks(tasks)
            } else {
                setTasks(null)
            }
        }
        return
    }

    async function updateHandler(user: User | null, task: TaskData, updatedTask: TaskData) {
        if (user && user.uid) {
            await updateUserTask(user.uid, task.id!, updatedTask)
            console.log(task)
            const tasks = await getUserTasks(user.uid)
            console.log(tasks)
            if (tasks) {
                setTasks(tasks)
            } else {
                setTasks(null)
            }
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
            {tasks && tasks.length > 0 && <div>
                {tasks.map((task) => (
                    <Task user={user} task={task} onDelete={confirmDelete} onEdit={handleEdit} key={task.id}/>
                ))}
            </div>}
            <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
                <TaskEditor user={user} onCreate={addHandler} onEdit={updateHandler}
                            onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>
        </div>
    );
}

export default Tasks;