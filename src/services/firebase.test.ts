import {vi, describe, it, expect, beforeEach} from 'vitest';
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from 'firebase/firestore';
import {FirestoreTaskStore} from './firebase.ts';

// 1. Mock the entire Firebase Firestore module
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    getFirestore: vi.fn(),
}));

describe('FirestoreTaskStore', () => {
    let store: FirestoreTaskStore;
    const mockDb = {} as any; // We don't need a real DB instance because functions are mocked

    beforeEach(() => {
        vi.clearAllMocks();
        store = new FirestoreTaskStore(mockDb);
    });

    describe('.add()', () => {
        it('should call addDoc with the correct collection path', async () => {
            const userId = 'user-1';
            const taskData = {title: 'Test Task'};
            const mockCollection = {id: 'mock-collection'};
            // Setup the mocks to return what the code expects
            vi.mocked(collection).mockReturnValue(mockCollection as any);
            vi.mocked(addDoc).mockResolvedValue({id: 'new-id'} as any);
            await store.add(userId, taskData as any);
            // Verify the path construction
            expect(collection).toHaveBeenCalledWith(mockDb, 'users', userId, 'tasks');
            // Verify the actual save call
            expect(addDoc).toHaveBeenCalledWith(mockCollection, taskData);
        });
    });
    describe('.getAll()', () => {
        it('should map Firestore documents to TaskData objects', async () => {
            // Create a mock snapshot that looks like what Firebase returns
            const mockDocs = [
                {id: '1', data: () => ({title: 'Task 1'})},
                {id: '2', data: () => ({title: 'Task 2'})},
            ];
            const mockSnapshot = {
                empty: false,
                docs: mockDocs,
            };
            vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);
            const result = await store.getAll('user-1');
            expect(result).toEqual([
                {id: '1', title: 'Task 1'},
                {id: '2', title: 'Task 2'},
            ]);
        });
        it('should return an empty array if snapshot is empty', async () => {
            vi.mocked(getDocs).mockResolvedValue({empty: true} as any);
            const result = await store.getAll('user-1');
            expect(result).toEqual([]);
        });
    });
    describe('.delete()', () => {
        it('should call deleteDoc with the correctly constructed document reference', async () => {
            // 1. Create a "fake" document reference
            const userId = 'user-123';
            const taskId = 'task-456';
            const mockDocRef = {id: 'mock-doc-ref'};
            vi.mocked(doc).mockReturnValue(mockDocRef as any);
            // 2. Execute the method
            await store.delete(userId, taskId);
            // 3. Verify the path was built correctly
            // path: db, "users", userId, "tasks", taskId
            expect(doc).toHaveBeenCalledWith(mockDb, 'users', userId, 'tasks', taskId);
            // 4. Verify deleteDoc was called with that specific reference
            expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
        });
    });

    describe('.update()', () => {
        it('should call updateDoc with the correct reference and partial data', async () => {
            const userId = 'user-123';
            const taskId = 'task-456';
            const mockDocRef = {id: 'mock-doc-ref'};
            const partialData = {title: 'Test Task'};
            vi.mocked(doc).mockReturnValue(mockDocRef as any);
            // Execute the method
            await store.update(userId, taskId, partialData);
            // Verify path construction
            expect(doc).toHaveBeenCalledWith(mockDb, 'users', userId, 'tasks', taskId);
            // Verify updateDoc was called with the ref AND the data
            expect(updateDoc).toHaveBeenCalledWith(mockDocRef, partialData);
        });
    });
});