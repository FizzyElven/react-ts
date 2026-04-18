import {BTN_VARIANT, TASK_STATUS, type TaskData, type TasksError} from "../types/types.ts";
import Button from "./ui/Button.tsx";
import {getBorderColor, getPriorityBar, getStatusEmoji} from "../utils/taskHelpers.ts";
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {memo} from 'react';

interface Props {
    task: TaskData,
    tasks: TaskData[] | null,
    onChangeStatus: (task: TaskData) => void,
    onDelete: (taskId: string) => void,
    onEdit: (task: TaskData) => void,
    onMove: (task: TaskData, direction?: "up" | "down") => void,
    canManuallySort: boolean,
    error: TasksError | null,
}

const Task = ({task, tasks, onChangeStatus, onDelete, onEdit, onMove, canManuallySort, error}: Props) => {
    if (!tasks) return
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: task.id!, disabled: !canManuallySort});
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <article aria-label={task.title} role="listitem" id={task.id} ref={setNodeRef} style={style}
                 className={"relative shadow-lg shadow-gray-200 flex items-start flex-col gap-2.5 border text-2xl p-2.5 rounded-3xl" + ` ${getBorderColor(task.status)}`}>
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <h3 className="font-bold">{task.title}</h3>
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
            <div className="flex flex-col h-full w-full justify-between gap-2.5">
                <p>{task.description}</p>
                {(error && error.taskId === task.id && error.errorScope === "update") && <p className="text-red-500 text-md">failed to update task status: {error.message}</p>}
                {(error && error.taskId === task.id && error.errorScope === "move") && <p className="text-red-500 text-md">failed to update task position: {error.message}</p>}
                <div className="flex flex-col gap-2.5">
                    {canManuallySort && <div className="flex justify-between w-full">
                      <div className="flex gap-2.5">
                        <button aria-label={`Move ${task.title} up`} disabled={!canManuallySort}
                                onClick={() => onMove(task, "up")}
                                className="flex items-center justify-center hover:border-blue-400 focus-within:border-blue-300 transition hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 text-2xl border-blue-600 px-2.5 rounded-full w-10 h-10 cursor-pointer">
                          ↑
                        </button>
                        <button aria-label={`Move ${task.title} down`} disabled={!canManuallySort}
                                onClick={() => onMove(task, "down")}
                                className="flex items-center justify-center hover:border-blue-400 focus-within:border-blue-300 transition hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 text-2xl border-blue-600 px-2.5 rounded-full w-10 h-10 cursor-pointer">
                          ↓
                        </button>
                      </div>
                      <button aria-label={`drag ${task.title}`}
                              className="drag-handle p-5 rounded-xl w-3 h-6 cursor-grab" {...attributes} {...listeners}/>
                    </div>
                    }
                    <div className="flex justify-between w-full">
                        {task.status === TASK_STATUS.ACTIVE &&
                          <Button aria-label={`Complete ${task.title}`} btnVariant={BTN_VARIANT.PRIMARY}
                                  onClick={() => onChangeStatus({...task, status: TASK_STATUS.COMPLETED})}>
                            Complete
                          </Button>}
                        {task.status === TASK_STATUS.IDLE &&
                          <Button aria-label={`Start ${task.title}`} btnVariant={BTN_VARIANT.PRIMARY}
                                  onClick={() => onChangeStatus({...task, status: TASK_STATUS.ACTIVE})}>
                            Start
                          </Button>}
                        <Button aria-label={`Edit ${task.title}`} btnVariant={BTN_VARIANT.PRIMARY}
                                onClick={() => onEdit(task)}>
                            Edit
                        </Button>
                        <Button aria-label={`Delete ${task.title}`} btnVariant={BTN_VARIANT.DANGER}
                                onClick={() => onDelete(task.id!)}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export const SortableTaskItem = memo(Task);