import {type ChangeEvent, useContext, useMemo, useState} from "react";
import {FireContext} from "../Context.tsx";
import {
    BTN_VARIANT,
    TASK_PRIORITY,
    TASK_STATUS,
    type ConfirmDialog,
    type SortArrayConfig,
    type TaskData, type FilterConfig
} from "../types/types.ts";
import Task from "./Task.tsx";
import Modal from "./Modal.tsx";
import TaskEditor from "./TaskEditor.tsx";
import {filterArray} from "../utils/filter.ts";
import {moveItem, sortArray} from "../utils/sort.ts";
import {searchInArray} from "../utils/search.ts";
import {useNavigate} from "react-router";
import {CUSTOM_SORT_STEP, SORT_DIRECTION, SORT_METHOD} from "../constants/sortConstants.ts";
import Filters from "./Filters.tsx";
import Button from "./ui/Button.tsx";
import InputField from "./ui/InputField.tsx";

function Tasks({setConfirmDialog}: { setConfirmDialog: (actions: ConfirmDialog | null) => void }) {
    const {user, taskService} = useContext(FireContext)
    const navigate = useNavigate();
    if (!user) {
        navigate("/login", {replace: true});
        return
    }
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [tasks, setTasks] = useState<TaskData[] | []>([]);
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig<TaskData>[]>([]);
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "id",
        direction: SORT_DIRECTION.ASC,
        sortMethod: SORT_METHOD.ALPHABETICAL,
    });
    const processedTasks = useMemo(() => {
        if (tasks && Object.entries(filtersConfig).length > 0) {
            const filteredTasks = filterArray(tasks, filtersConfig)
            if (!search) {
                return sortArray(filteredTasks, sortConfig)
            }
            const searchedTasks = searchInArray(filteredTasks, search, ["title", "description"]);
            return sortArray(searchedTasks, sortConfig)
        } else if (tasks) {
            if (!search) {
                return sortArray(tasks, sortConfig)
            }
            const searchedTasks = searchInArray(tasks, search, ["title", "description"]);
            return sortArray(searchedTasks, sortConfig)
        }
        return null
    }, [tasks, filtersConfig, sortConfig, search]);
    const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
        const logicalOrder = () => {
            switch (event.target.value) {
                case "priority":
                    return Object.values(TASK_PRIORITY)
                case "status":
                    return Object.values(TASK_STATUS)
            }
        }
        const sortingMethod = () => {
            switch (event.target.value) {
                case "priority":
                case "status":
                    return SORT_METHOD.LOGICAL
                case "createdAt":
                case "dueDate":
                case "customOrder":
                    return SORT_METHOD.NUMERICAL
                default:
                    return SORT_METHOD.ALPHABETICAL
            }
        }
        setSortConfig({
            key: event.target.value as keyof TaskData,
            direction: SORT_DIRECTION.ASC,
            sortMethod: sortingMethod(),
            logicOrder: logicalOrder()
        })
    }

    const handleCreate = () => {
        setEditTask(undefined)
        setIsEditorOpen(true);
    }
    const handleEdit = (task: TaskData) => {
        setEditTask(task);
        setIsEditorOpen(true);
    }
    const confirmDelete = (task: TaskData) => {
        setConfirmDialog(
            {
                title: "Delete Task",
                text: "Are you sure you want to delete this task?",
                confirmText: "Delete",
                btnVariant: BTN_VARIANT.DANGER,
                onConfirm: () => {
                    deleteHandler(task).then(() => setConfirmDialog(null));
                },
                onCancel: () => {
                    setConfirmDialog(null)
                }
            }
        )
    }

    async function getHandler() {
        if (user?.uid) {
            const tasks = await taskService.getUserTasks(user.uid)
            if (tasks && tasks.length > 0) {
                setTasks(tasks)
            } else {
                setTasks([])
            }
        }
        return
    }

    function getNextOrder(): number {
        if (tasks?.length === 0) return CUSTOM_SORT_STEP;
        return Math.max(...tasks.map(t => t.customOrder!)) + CUSTOM_SORT_STEP
    }

    async function addHandler(task: TaskData) {
        if (user?.uid) {
            await taskService.addTaskToUser(user.uid, {...task, createdAt: Date.now(), customOrder: getNextOrder()})
            await getHandler()
            setIsEditorOpen(false)
        }
        setIsEditorOpen(false)
        return
    }

    async function deleteHandler(task: TaskData) {
        if (user?.uid) {
            await taskService.deleteUserTask(user.uid, task.id!)
            await getHandler()
        }
        return
    }

    async function updateHandler(task: TaskData, updatedTask: TaskData) {
        if (user?.uid) {
            await taskService.updateUserTask(user.uid, task.id!, updatedTask)
            await getHandler()
        }
        setIsEditorOpen(false)
        return
    }

    async function moveTaskHandler(task: TaskData, index: number, moveTo: "up" | "down") {
        setSortConfig({...sortConfig, key: "customOrder", sortMethod: SORT_METHOD.NUMERICAL})
        const newOrder = moveItem(processedTasks, index, moveTo, sortConfig.direction)
        if (!newOrder) return
        await updateHandler(task, {...task, customOrder: newOrder})
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
            <div className="flex justify-around items-center w-full">
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={handleCreate}>CREATE NEW TASK</Button>
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={getHandler}>GET TASKS</Button>
            </div>
            <Filters setFiltersConfig={setFiltersConfig} filtersConfig={filtersConfig}/>
            <div className="flex items-center gap-2.5">
                <InputField onChange={event => setSearch(event.target.value)} placeholder="Search Tasks">🔍</InputField>
                <div className="group shadow-lg transition shadow-gray-200 hover:border-blue-400
                    focus-within:border-blue-300 focus-within:shadow-lg border-2 border-blue-600 rounded-full px-2 text-2xl p-2.5 flex gap-2.5">
                    <select
                        className="outline-none"
                        name="sort" value={sortConfig.key}
                        onChange={handleSorting}>
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                        <option value="priority">Priority</option>
                        <option value="createdAt">Creation time</option>
                        <option value="customOrder">Custom order</option>
                    </select>
                </div>
                <button
                    className="cursor-pointer font-bold border border-blue-500 transition shadow-lg shadow-gray-200 hover:border-blue-400 hover:border-2 w-10 h-10
                    focus-within:border-blue-300 focus-within:shadow-lg rounded-full px-2 text-2xl p-2.5 flex gap-2.5"
                    onClick={() => setSortConfig(prevState => {
                        return {
                            ...prevState,
                            direction: prevState.direction === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                        }
                    })}><p
                    className={"duration-300 transition-transform text-3xl w-full h-full leading-none flex items-center justify-center " + `${sortConfig.direction === SORT_DIRECTION.ASC ? "rotate-180" : "rotate-0"}`}>↓</p>
                </button>
            </div>

            {processedTasks && processedTasks.length > 0 ?
                <div className="flex gap-5 flex-wrap items-start w-full justify-center">
                    {processedTasks.map((task) => (
                        <Task canManuallySort={sortConfig.key === "customOrder"} task={task} tasks={processedTasks}
                              onChangeStatus={(task) => updateHandler(task, task)} onDelete={confirmDelete}
                              onEdit={handleEdit} key={task.id} onMove={moveTaskHandler}/>
                    ))}
                </div> : <div className="mt-36 flex flex-col items-center text-2xl">You currently have no tasks</div>}
            {isEditorOpen && <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
              <TaskEditor onCreate={addHandler} onEdit={updateHandler}
                          onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>}
        </div>
    );
}

export default Tasks;