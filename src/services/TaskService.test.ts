import {TaskService} from "./TaskService.ts";
import {beforeEach, describe, expect, vi, it} from "vitest";
import type {TaskData, TaskStore} from "../types/types.ts";

describe('TaskService', () => {
    let service: TaskService;
    let mockStore: TaskStore;

    beforeEach(() => {
        // 1. Create a mock object that implements the TaskStore interface
        mockStore = {
            add: vi.fn(),
            getAll: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
        };

        // 2. Inject the mock into the service
        service = new TaskService(mockStore);
    });

    describe('.addTaskToUser()', () => {
        it('should call the store with correct parameters', async () => {
            const userId = 'user-123';
            const task: TaskData = {
                id: 't1',
                title: 'Task 1',
                description: "sad",
                priority: "low",
                status: "completed"
            };
            await service.addTaskToUser(userId, task);
            // Verify the Service correctly delegated the work to the Store
            expect(mockStore.add).toHaveBeenCalledWith(userId, task);
        });
    });
    describe('.getUserTasks()', () => {
        it('should return data received from the store', async () => {
            const mockTasks: TaskData[] = [{
                id: 't1',
                title: 'Task 1',
                description: "sad",
                priority: "low",
                status: "completed"
            }];
            // Tell the mock what to return for this specific test
            vi.mocked(mockStore.getAll).mockResolvedValue(mockTasks);
            const result = await service.getUserTasks('user-123');
            expect(result).toEqual(mockTasks);
            expect(mockStore.getAll).toHaveBeenCalledWith('user-123');
        });
    });
    describe('.deleteUserTask()', () => {
        it('should call the store with correct parameters', async () => {
            const userId = 'user-123';
            const taskId = 't1';
            await service.deleteUserTask(userId, taskId);
            expect(mockStore.delete).toHaveBeenCalledWith(userId, taskId);
        })
    })
    describe('.updateUserTask()', () => {
        it('should call the store with correct parameters', async () => {
            const userId = 'user-123';
            const taskId = 't1';
            const taskData: Partial<TaskData> = {title: 'Task 1', description: "description"}
            await service.updateUserTask(userId, taskId, taskData);
            expect(mockStore.update).toHaveBeenCalledWith(userId, taskId, taskData)
        })
    })
});