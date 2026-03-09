export interface TaskData {
    id?: string;
    tittle: string;
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