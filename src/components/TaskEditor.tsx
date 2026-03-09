import {useEffect, useState} from "react";
import type {TaskData} from "../types/types.ts";
import type {User} from "firebase/auth";

interface TaskEditorProps {
    onCancel: () => void;
    user: User | null;
    onCreate: (user: User | null, task: TaskData) => Promise<void>
    onEdit: (user: User | null, task: TaskData, initialTask: TaskData) => Promise<void>;
    initialTask?: TaskData;
}

function TaskEditor({onCancel, onCreate, onEdit, initialTask, user}: TaskEditorProps) {
    const [editedTask, setEditedTask] = useState<TaskData>({
        tittle: "",
        description: "",
        priority: "low",
        status: "idle",
    });
    useEffect(() => {
        if (initialTask) {
            setEditedTask(initialTask)
        } else {

        }
    },[initialTask])
    const handleSubmit = () => {
        console.log("handleSubmit");
        if (initialTask) {
           return onEdit(user, initialTask, editedTask);
        } else {
           return onCreate(user, editedTask)
        }
    }
    console.log("task editor render")

    function updateField(field: keyof TaskData, value: any) {
        setEditedTask(task => ({
            ...task,
            [field]: value
        }))
    }

    return (
        <div className="flex flex-col gap-2.5 justify-center items-center p-5 text-2xl font-bold w-max">
            <h2>{initialTask ? "Edit Task" : "Create New Task"}</h2>
            <form className="flex flex-col gap-5 mb-5" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="tittle">Tittle:</label>
                <input id="tittle" defaultValue={editedTask?.tittle}
                       className="border-2 border-blue-600 rounded-md px-2"
                       onBlur={(event) => updateField("tittle", event.target.value)}/>
                <label htmlFor="description">Description:</label>
                <input id="description" defaultValue={editedTask?.description}
                       className="border-2 border-blue-600 rounded-md px-2"
                       onBlur={(event) => updateField("description", event.target.value)}/>
                <div className="flex items-center gap-2">
                    <p>Status:</p>
                    <div className="flex gap-3">
                        <input id="idle" value="idle" name="status" type="radio"
                               defaultChecked={editedTask?.status === "idle"}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="idle">idle</label>
                        <input id="inprogress" value="in progress" name="status" type="radio"
                               defaultChecked={editedTask?.status === "in progress"}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="inprogress">in progress</label>
                        <input id="completed" value="completed" name="status" type="radio"
                               defaultChecked={editedTask?.status === "completed"}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="completed">completed</label>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p>Priority:</p>
                    <div className="flex gap-3">
                        <input id="low" value="low" name="priority" type="radio"
                               defaultChecked={editedTask?.priority === "low"}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="low">low</label>
                        <input id="medium" value="medium" name="priority" type="radio"
                               defaultChecked={editedTask?.priority === "medium"}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="medium">medium</label>
                        <input id="high" value="high" name="priority" type="radio"
                               defaultChecked={editedTask?.priority === "high"}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="high">high</label>
                    </div>
                </div>
            </form>
            <div className="flex justify-between items-center w-sm">
                <button onClick={handleSubmit}
                        className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">
                    Submit
                </button>
                <button onClick={onCancel}
                        className="text-white text-2xl bg-red-600 font-bold p-2.5 rounded-md cursor-pointer w-max">
                    Cancel
                </button>
                <button onClick={() => console.log(editedTask)}>log</button>
            </div>
        </div>
    );
}

export default TaskEditor;