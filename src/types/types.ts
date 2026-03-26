import type {sortDirection, SortMethod} from "../constants/sortConstants.ts";

export const BTN_VARIANT = {
    PRIMARY: "primary",
    DANGER: "danger",
} as const;
export const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
} as const;
export const TASK_STATUS = {
    IDLE: "idle",
    ACTIVE: "active",
    COMPLETED: "completed",
    OVERDUE: "overdue",
} as const;
export type btnVariant = (typeof BTN_VARIANT)[keyof typeof BTN_VARIANT]
export type taskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY]
export type taskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export interface TaskData {
    id?: string;
    createdAt?: number;
    dueDate?: number;
    title: string;
    description: string;
    priority: taskPriority;
    status: taskStatus;
    customOrder?: number;
}

export interface ConfirmDialog {
    title: string,
    text: string,
    btnVariant: btnVariant,
    confirmText: string,
    onConfirm: () => void
    onCancel: () => void
}

export interface SortArrayConfig<T, K extends keyof T = keyof T> {
    key: K;
    direction: sortDirection;
    sortMethod: SortMethod;
    logicOrder?: string[] | null;
}
export interface FilterConfig <T>{
    field?: keyof T,
    value?: any | any[]
}
export const FILTERS = {
    STATUS: "status",
    PRIORITY: "priority",
    OTHER: "other",
} as const;
export type FilterType = typeof FILTERS[keyof typeof FILTERS];