export interface TaskData {
    id?: string;
    tittle: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "idle" | "in progress" | "completed";
}