import type {sortDirection, SortMethod} from "../constants/sortConstants.ts";
import type {Unsubscribe, User} from "firebase/auth";

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

export interface TaskStore {
    add(userId: string, taskData: TaskData): Promise<void>

    getAll(userId: string): Promise<TaskData[]>

    delete(userId: string, taskId: string): Promise<void>

    update(userId: string, taskId: string, taskData: Partial<TaskData>): Promise<void>
}

export interface AuthProvider {
    login(): Promise<User | null>;
    logout(): Promise<void>;
    checkLoggedIn(callback: (user: User | null) => void): Unsubscribe;
}

export interface TaskData {
    id: string;
    createdAt?: number;
    dueDate?: number | null;
    title: string;
    description: string;
    priority: taskPriority;
    status: taskStatus;
    customOrder: number;
}

export interface ConfirmOptions {
    title: string,
    text: string,
    btnVariant: btnVariant,
    confirmText: string,
    confirmAction: () => Promise<Result<any>>
}

export interface SortArrayConfig<T, K extends keyof T = keyof T> {
    key: K;
    direction: sortDirection;
    sortMethod: SortMethod;
    logicOrder?: string[] | null;
}

export interface FilterConfig<T> {
    field?: keyof T | "other",
    value?: any | any[]
}

export const FILTERS = {
    STATUS: "status",
    PRIORITY: "priority",
    OTHER: "other",
} as const;
export type FilterType = typeof FILTERS[keyof typeof FILTERS];

export type ErrorScope = "get" | "add" | "update" | "move" | "delete"

export interface TasksError {
    message: string;
    errorScope: ErrorScope;
    taskId?: string;
}

export type Result<T> = | { success: true; data: T; error: null } | { success: false; data: null; error: Error };