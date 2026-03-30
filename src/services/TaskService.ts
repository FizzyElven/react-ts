import type {TaskData, TaskStore} from "../types/types.ts";

export class TaskService {
    private readonly store: TaskStore;

    constructor(store: TaskStore) {
        this.store = store;
    }

    async addTaskToUser(userId: string, taskData: TaskData) {
        return this.store.add(userId, taskData);
    }

    async getUserTasks(userId: string) {
        return this.store.getAll(userId);
    }

    async deleteUserTask(userId: string, taskId: string) {
        return this.store.delete(userId, taskId);
    }

    async updateUserTask(userId: string, taskId: string, taskData: Partial<TaskData>) {
        return this.store.update(userId, taskId, taskData);
    }
}