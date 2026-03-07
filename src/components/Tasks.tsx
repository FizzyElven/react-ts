import {useContext, useState} from "react";
import {FireContext} from "../Context.tsx";
import {addTaskToUser, deleteUserTask, getUserTasks, updateUserTask} from "../services/firebase.ts";
import type {TaskData} from "../types/types.ts";
import Task from "./Task.tsx";
import type {User} from "firebase/auth";

function Tasks() {
    const {user} = useContext(FireContext)
    const [tasks, setTasks] = useState<TaskData[] | null>(null);
    console.log(user?.uid)

    async function addHandler() {
        if (user && user.uid) {
            await addTaskToUser(user?.uid, {
                tittle: "Test task",
                description: "this is test task",
                status: "idle",
                priority: "high",
            })
            const tasks = await getUserTasks(user?.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            }
        }
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
        return
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
            <div className="flex justify-between items-center w-xl">
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={addHandler}>
                    TEST add task
                </button>
                <button className="border-2 text-2xl border-blue-600 font-bold p-2.5 rounded-md cursor-pointer"
                        onClick={getHandler}>
                    TEST get tasks
                </button>
            </div>
            {tasks && tasks.length > 0 && <div>
                {tasks.map((task) => (
                    <Task user={user} task={task} onDelete={deleteHandler} onEdit={updateHandler} key={task.id}/>
                ))}
            </div>}
        </div>
    );
}

export default Tasks;