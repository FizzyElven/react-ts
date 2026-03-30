import {useState} from "react";
import {BTN_VARIANT, TASK_PRIORITY, TASK_STATUS, type TaskData} from "../types/types.ts";
import Button from "./ui/Button.tsx";
import InputField from "./ui/InputField.tsx";

interface TaskEditorProps {
    onCancel: () => void;
    onCreate: (task: TaskData) => Promise<void>
    onEdit: (taskId: string, initialTask: TaskData) => Promise<void>;
    initialTask?: TaskData;
}

function TaskEditor({onCancel, onCreate, onEdit, initialTask}: TaskEditorProps) {
    const [editedTask, setEditedTask] = useState<TaskData>(initialTask ? initialTask : {
        title: "",
        description: "",
        priority: TASK_PRIORITY.LOW,
        status: TASK_STATUS.IDLE,
        customOrder: 0,
    });

    const handleSubmit = () => {
        if (initialTask) {
            return onEdit(initialTask.id!, editedTask);
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
        <div className="flex flex-col gap-2.5 justify-center items-center p-5 text-2xl w-max">
            <h2 className="font-bold">{initialTask ? "Edit Task" : "Create New Task"}</h2>
            <form className="flex flex-col items-center gap-2.5 mb-5" onSubmit={(event) => event.preventDefault()}>
                <InputField label="Tittle" defaultValue={editedTask?.title}
                            onBlur={(event) => updateField("title", event.target.value)}/>
                <InputField label="Description" defaultValue={editedTask?.description}
                            onBlur={(event) => updateField("description", event.target.value)}/>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Status</p>
                    <div className="flex gap-3 items-center">
                        <input id="idle" value={TASK_STATUS.IDLE} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.IDLE}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="idle">idle</label>
                        <input id="active" value={TASK_STATUS.ACTIVE} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.ACTIVE}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="active">active</label>
                        <input id="completed" value={TASK_STATUS.COMPLETED} name="status" type="radio"
                               checked={editedTask?.status === TASK_STATUS.COMPLETED}
                               onChange={(event) => updateField("status", event.target.value)}/>
                        <label htmlFor="completed">completed</label>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Priority</p>
                    <div className="flex gap-3 items-center">
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
                    <div className="flex flex-col items-center">
                        <p className="font-bold">Optional</p>
                        <div className="flex items-center justify-center gap-3">
                            <input className="size-4" id="deadline" value="deadline" type="checkbox"
                                   onChange={() => toggleOptionalProps("dueDate", Date.now())}/>
                            <label className="flex items-center" htmlFor="deadline">deadline</label>
                        </div>
                    </div>
                    {editedTask.dueDate &&
                      <input defaultValue={new Date(editedTask.dueDate).toISOString().slice(0, 16)} id="deadline-time"
                             type="datetime-local"
                             onBlur={(event) => updateField("dueDate", new Date(event.target.value).getTime() / 1000)}/>}
                </div>
            </form>
            <div className="flex justify-between items-center w-sm">
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={handleSubmit}>
                    Submit
                </Button>
                <Button btnVariant={BTN_VARIANT.DANGER} onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default TaskEditor;