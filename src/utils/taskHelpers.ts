import {TASK_PRIORITY, TASK_STATUS, type taskPriority, type taskStatus} from "../types/types.ts";

export function getBorderColor(status: taskStatus) {
    switch (status) {
        case TASK_STATUS.IDLE:
            return "border-grey-600"
        case TASK_STATUS.ACTIVE:
            return "border-blue-600"
        case TASK_STATUS.COMPLETED:
            return "border-green-600"
        case TASK_STATUS.OVERDUE:
            return "border-red-600"
    }
}

export function getStatusEmoji(status: taskStatus) {
    switch (status) {
        case TASK_STATUS.IDLE:
            return "😴"
        case TASK_STATUS.ACTIVE:
            return "⚡"
        case TASK_STATUS.COMPLETED:
            return "✔️"
        case TASK_STATUS.OVERDUE:
            return "❌"
    }
}

export function getPriorityBar(priority: taskPriority) {
    switch (priority) {
        case TASK_PRIORITY.LOW:
            return "left-3.75"
        case TASK_PRIORITY.MEDIUM:
            return "left-11"
        case TASK_PRIORITY.HIGH:
            return "right-1.5"
    }
}