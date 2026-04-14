import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import Tasks from "../pages/Tasks.tsx";
import {FireContext} from "../FireContext.tsx";
import {ConfirmProvider} from "../ConfirmContext.tsx";
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {TASK_PRIORITY, TASK_STATUS, type TaskData} from "../types/types.ts";
import type {ReactElement} from "react";

const renderWithContext = (ui: ReactElement, value: any) => {
    return render(
        <FireContext.Provider value={value}>
            <ConfirmProvider>
                {ui}
            </ConfirmProvider>
        </FireContext.Provider>
    );
};
describe("Tasks component", () => {
    test("tasks page renders correctly", async () => {
        renderWithContext(<Tasks/>, {user: {uid: "1"}})
        await screen.findByRole("button", {name: /get tasks/i});
    })
    test("get tasks button calls get tasks", async () => {
        const user = userEvent.setup()
        const mockTaskService = {
            getUserTasks: vi.fn().mockResolvedValue([]),
        }
        const getUserTasksSpy = vi.spyOn(mockTaskService, "getUserTasks")
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        expect(getUserTasksSpy).toHaveBeenCalled()
    })
    test("delete button calls deleteUserTask", async () => {
        const user = userEvent.setup()
        const testTask: any = {
            title: "Test task",
            description: "Test description",
            priority: TASK_PRIORITY.LOW,
            status: TASK_STATUS.ACTIVE,
            id: "0000",
        }
        const mockTaskService = {
            getUserTasks: vi.fn().mockResolvedValue([testTask]),
            deleteUserTask: vi.fn(),
        }
        const spy = vi.spyOn(mockTaskService, "deleteUserTask")
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        await user.click(screen.getByRole("button", {name: /delete test Task/i}))
        await screen.findByText(/delete task/i)
        await user.click(screen.getByRole("button", {name: /confirm dialog, confirm delete task/i}))
        expect(spy).toHaveBeenCalledWith("1", "0000")
    })
})
describe("Task Editor", () => {
    test("create new task button opens task editor in creation mode", async () => {
        const user = userEvent.setup()
        renderWithContext(<Tasks/>, {user: {uid: "1"}})
        await user.click(screen.getByRole("button", {name: /create new task/i}))
        screen.getByRole("heading", {name: /create new task/i})
    })
    test("submit button in task editor in creation mode calls addTaskToUser function", async () => {
        const user = userEvent.setup()
        const mockTaskService = {getUserTasks: vi.fn().mockResolvedValue([]), addTaskToUser: vi.fn()}
        const spy = vi.spyOn(mockTaskService, "addTaskToUser")
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /create new task/i}))
        screen.getByRole("heading", {name: /create new task/i})
        await user.type(screen.getByRole("textbox", {name: /title/i}), "test title")
        await user.type(screen.getByRole("textbox", {name: /description/i}), "test description")
        await user.click(screen.getByRole("radio", {name: /active/i}))
        await user.click(screen.getByRole("radio", {name: /high/i}))
        await user.click(screen.getByRole("button", {name: /submit/i}))
        expect(spy).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                title: "test title",
                description: "test description",
                priority: TASK_PRIORITY.HIGH,
                status: TASK_STATUS.ACTIVE,
                customOrder: 100,
                createdAt: expect.any(Number)
            }))
    })
    test("Opening task editor in edit mode should set inputs values to initial task data", async () => {
        const user = userEvent.setup()
        const testTask: TaskData = {
            title: "Test task",
            description: "Test description",
            priority: TASK_PRIORITY.LOW,
            status: TASK_STATUS.ACTIVE,
            id: "1",
            customOrder: 100,
        }
        const mockTaskService = {getUserTasks: vi.fn().mockResolvedValue([testTask]), updateUserTask: vi.fn()}
        const spy = vi.spyOn(mockTaskService, "updateUserTask")
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        await user.click(screen.getByRole("button", {name: /edit test Task/i}))
        screen.getByRole("heading", {name: /edit task/i})
        await user.click(screen.getByRole("button", {name: /submit/i}))
        expect(spy).toHaveBeenCalledWith("1", "1", testTask)
    })
})
describe("sorting and filtering tasks", async () => {
    const getTasksTitles = () => screen.getAllByRole('heading', {level: 3}).map(h => h.textContent)
    const user = userEvent.setup()
    const testTasks: TaskData[] = [
        {
            title: "first task",
            description: "idle task with low priority",
            priority: TASK_PRIORITY.LOW,
            status: TASK_STATUS.OVERDUE,
            id: "1",
            customOrder: 100,
            createdAt: 1000,
        },
        {
            title: "second task",
            description: "active task with medium priority",
            priority: TASK_PRIORITY.HIGH,
            status: TASK_STATUS.COMPLETED,
            id: "2",
            customOrder: 200,
            createdAt: 2000,
        },
        {
            title: "third task",
            description: "completed task with high priority",
            priority: TASK_PRIORITY.MEDIUM,
            status: TASK_STATUS.IDLE,
            id: "3",
            customOrder: 300,
            createdAt: 3000,
        },
        {
            title: "forth task",
            description: "overdue task with low priority",
            priority: TASK_PRIORITY.LOW,
            status: TASK_STATUS.ACTIVE,
            id: "4",
            customOrder: 400,
            createdAt: 4000,
        },
    ]
    const mockTaskService = {getUserTasks: vi.fn().mockResolvedValue(testTasks), updateUserTask: vi.fn()}

    test("searching tasks", async () => {
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        await user.type(screen.getByRole("textbox", {name: /search task/i}), "first")
        await screen.findByRole("heading", {name: /first task/i})
        expect(screen.queryByText(/second/i)).not.toBeInTheDocument();
        screen.getByRole("heading", {name: /first task/i})
    })
    test("sorting tasks", async () => {
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        const tasksSortedByTitle = getTasksTitles()
        expect(tasksSortedByTitle).toEqual(["first task", "forth task", "second task", "third task"])
        const select = screen.getByRole('combobox', {name: /Select how to sort tasks/i})
        await user.selectOptions(select, 'priority')
        expect(select).toHaveValue('priority')
        const tasksSortedByPriority = getTasksTitles()
        expect(tasksSortedByPriority).toEqual(["first task", "forth task", "third task", "second task"])
        await user.selectOptions(select, 'status')
        const tasksSortedByStatus = getTasksTitles()
        expect(tasksSortedByStatus).toEqual(["third task", "forth task", "second task", "first task"])
        await user.selectOptions(select, 'createdAt')
        const tasksSortedByDate = getTasksTitles()
        expect(tasksSortedByDate).toEqual(["first task", "second task", "third task", "forth task"])
        await user.click(screen.getByRole("button", {name: /sort Descending/i}))
        const tasksSortedByDateDescending = getTasksTitles()
        expect(tasksSortedByDateDescending).toEqual(["forth task", "third task", "second task", "first task"])
    })
    test("filtering tasks", async () => {
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        fireEvent.click(screen.getByRole("button", {name: /filter priority/i}))
        fireEvent.click(screen.getByRole('checkbox', {name: /low/i}))
        let tasksTitles = getTasksTitles()
        expect(tasksTitles).toEqual(["first task", "forth task"])
        fireEvent.click(screen.getByRole('checkbox', {name: /high/i}))
        tasksTitles = getTasksTitles()
        expect(tasksTitles).toEqual(["second task"])
        fireEvent.click(screen.getByRole("button", {name: /remove filter priority: high/i}))
        tasksTitles = getTasksTitles()
        expect(tasksTitles).toEqual(["first task", "forth task", "second task", "third task"])
        fireEvent.click(screen.getByRole('checkbox', {name: /medium/i}))
        await user.click(screen.getByRole("button", {name: /clear filters/i}))
        tasksTitles = getTasksTitles()
        expect(tasksTitles).toEqual(["first task", "forth task", "second task", "third task"])
    })
    test("custom sorting tasks", async () => {
        const spy = vi.spyOn(mockTaskService, "updateUserTask")
        renderWithContext(<Tasks/>, {user: {uid: "1"}, taskService: mockTaskService})
        await user.click(screen.getByRole("button", {name: /get tasks/i}))
        const select = screen.getByRole('combobox', {name: /Select how to sort tasks/i})
        await user.selectOptions(select, 'Custom order')
        let tasksTitles = getTasksTitles()
        expect(tasksTitles).toEqual(["first task", "second task", "third task", "forth task"])
        await user.click(screen.getByRole("button", {name: /move second task up/i}))
        expect(spy).toHaveBeenCalledWith("1", "2", {
            createdAt: 2000,
            customOrder: 50,
            description: "active task with medium priority",
            id: "2",
            priority: "high",
            status: "completed",
            title: "second task"
        });
        await user.click(screen.getByRole("button", {name: /move second task down/i}))
        expect(spy).toHaveBeenCalledWith("1", "2", {
            createdAt: 2000,
            customOrder: 350,
            description: "active task with medium priority",
            id: "2",
            priority: "high",
            status: "completed",
            title: "second task"
        });
    })
})