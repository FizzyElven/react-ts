import {BTN_VARIANT, TASK_STATUS, type TaskData} from "../types/types.ts";
import Button from "./ui/Button.tsx";
import {getBorderColor, getPriorityBar, getStatusEmoji} from "../utils/taskHelpers.ts";

interface Props {
    task: TaskData,
    tasks: TaskData[] | null,
    onChangeStatus: (task: TaskData) => void,
    onDelete: (taskId: string) => void,
    onEdit: (task: TaskData) => void,
    onMove: (task: TaskData, index: number, direction: "up" | "down") => void,
    canManuallySort: boolean,
}

const Task = ({task, tasks, onChangeStatus, onDelete, onEdit, onMove, canManuallySort}: Props) => {
    if (!tasks) return

    return (
        <div
            className={"relative shadow-lg shadow-gray-200 flex items-start flex-col gap-2.5 border w-1/4 text-2xl p-2.5 rounded-3xl" + ` ${getBorderColor(task.status)}`}>
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <p className="font-bold">{task.title}</p>
                    <div className="flex items-center">
                        <p className="font-bold">{task.status}</p>
                        <div role="img" aria-label={`Status: ${task.status}`}
                             title={`This task status is ${task.status}`}>{getStatusEmoji(task.status)}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full">
                    <p className="text-sm">Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}</p>
                    <div className="priority-bar relative text-sm flex items-center justify-center leading-none"
                         title={`This task priority is ${task.priority}`}>
                        {task.priority}
                        <div role="graphics-symbol"
                             aria-label={`Priority: ${task.priority}`}
                             className={"triangle-pointer absolute top-4" + ` ${getPriorityBar(task.priority)}`}>
                        </div>
                    </div>
                </div>
                {task.dueDate && <p className="text-sm">Target Date: {new Date(task.dueDate).toLocaleString()}</p>}
            </div>

            <hr className="w-full"/>
            <p>{task.description}</p>
            <div className="flex justify-between w-full">
                {task.status === TASK_STATUS.ACTIVE &&
                  <Button btnVariant={BTN_VARIANT.PRIMARY}
                          onClick={() => onChangeStatus({...task, status: TASK_STATUS.COMPLETED})}>
                    Complete
                  </Button>}
                {task.status === TASK_STATUS.IDLE &&
                  <Button btnVariant={BTN_VARIANT.PRIMARY}
                          onClick={() => onChangeStatus({...task, status: TASK_STATUS.ACTIVE})}>
                    Start
                  </Button>}
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={() => onEdit(task)}>
                    Edit
                </Button>
                <Button btnVariant={BTN_VARIANT.DANGER} onClick={() => onDelete(task.id!)}>
                    Delete
                </Button>
            </div>
            {canManuallySort && <div className="flex gap-2.5">
              <button disabled={!canManuallySort}
                      onClick={() => onMove(task, tasks.findIndex(t => t.id === task.id), "up")}
                      className="flex items-center justify-center hover:border-blue-400 focus-within:border-blue-300 transition hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 text-2xl border-blue-600 px-2.5 rounded-full w-10 h-10 cursor-pointer">
                ↑
              </button>
              <button disabled={!canManuallySort}
                      onClick={() => onMove(task, tasks.findIndex(t => t.id === task.id), "down")}
                      className="flex items-center justify-center hover:border-blue-400 focus-within:border-blue-300 transition hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 text-2xl border-blue-600 px-2.5 rounded-full w-10 h-10 cursor-pointer">
                ↓
              </button>
            </div>}
        </div>
    );
};

export default Task;