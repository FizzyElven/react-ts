export interface TaskData {
    id?: string;
    createdAt?: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "idle" | "in progress" | "completed";
}

export interface ConfirmDialog {
    title: string,
    text: string,
    btnVariant: "primary" | "danger",
    confirmText: string,
    onConfirm: () => void
    onCancel: () => void
}
export interface SortArrayConfig<T, K extends keyof T = keyof T> {
    key: K;
    direction: "asc" | "desc";
    sortMethod: "alphabetical" | "numerical" | "logical";
    logicOrder?: string[] | null;
}