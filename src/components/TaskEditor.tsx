import {useState} from "react";
import {TASK_PRIORITY, TASK_STATUS, type TaskData} from "../types/types.ts";

interface TaskEditorProps {
    onCancel: () => void;
    onCreate: (task: TaskData) => Promise<void>
    onEdit: (task: TaskData, initialTask: TaskData) => Promise<void>;
    initialTask?: TaskData;
}

function TaskEditor({onCancel, onCreate, onEdit, initialTask}: TaskEditorProps) {
    const [editedTask, setEditedTask] = useState<TaskData>(initialTask ? initialTask : {
        title: "",
        description: "",
        priority: TASK_PRIORITY.LOW,
        status: TASK_STATUS.IDLE,
    });

    const handleSubmit = () => {
        if (initialTask) {
           return onEdit(initialTask, editedTask);
        } else {
           return onCreate(editedTask)
        }
    }

    function updateField(field: keyof TaskData, value: any) {
        setEditedTask(task => ({
            ...task,
            [field]: value
        }))
    }
    function toggleOptionalProps(prop: keyof TaskData, value?: any) {
        if (editedTask.hasOwnProperty(prop)) {
            delete editedTask[prop];
            setEditedTask({...editedTask});
            return;
        } else {
            setEditedTask({...editedTask, [prop]: value});
            return;
        }
    }
    return (
        <div className="flex flex-col gap-2.5 justify-center items-center p-5 text-2xl font-bold w-max">
            <h2>{initialTask ? "Edit Task" : "Create New Task"}</h2>
            <form className="flex flex-col gap-5 mb-5" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="title">Title:</label>
                <input id="title" defaultValue={editedTask?.title}
                       className="border-2 border-blue-600 rounded-md px-2"
                       onBlur={(event) => updateField("title", event.target.value)}/>
                <label htmlFor="description">Description:</label>
                <input id="description" defaultValue={editedTask?.description}
                       className="border-2 border-blue-600 rounded-md px-2"
                       onBlur={(event) => updateField("description", event.target.value)}/>
                <div className="flex items-center gap-2">
                    <p>Status:</p>
                    <div className="flex gap-3">
                        <input id="idle" value={TASK_STATUS.IDLE} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.IDLE}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="idle">idle</label>
                        <input id="inprogress" value={TASK_STATUS.IN_PROGRESS} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.IN_PROGRESS}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="inprogress">in progress</label>
                        <input id="completed" value={TASK_STATUS.COMPLETED} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.COMPLETED}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="completed">completed</label>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p>Priority:</p>
                    <div className="flex gap-3">
                        <input id="low" value={TASK_PRIORITY.LOW} name="priority" type="radio"
                               checked={editedTask?.priority === TASK_PRIORITY.LOW}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="low">low</label>
                        <input id="medium" value={TASK_PRIORITY.MEDIUM} name="priority" type="radio"
                               checked={editedTask?.priority === TASK_PRIORITY.MEDIUM}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="medium">medium</label>
                        <input id="high" value={TASK_PRIORITY.HIGH} name="priority" type="radio"
                               checked={editedTask?.priority === TASK_PRIORITY.HIGH}
                               onChange={(event) => updateField("priority", event.target.value)}/>
                        <label htmlFor="high">high</label>
                    </div>
                </div>
                <div className="flex gap-2 flex-col">
                    <div className="flex gap-3">
                    <p>Optional:</p>
                        <input id="deadline" value="deadline" type="checkbox" onChange={()=>toggleOptionalProps("dueDate", Date.now())}/>
                        <label htmlFor="deadline">deadline</label>
                    </div>
                    {editedTask.dueDate && <input defaultValue={new Date(editedTask.dueDate).toISOString().slice(0,16)} id="deadline-time" type="datetime-local"
                            onBlur={(event) => updateField("dueDate", new Date(event.target.value).getTime() / 1000)}/>}
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