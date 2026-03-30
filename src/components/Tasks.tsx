import {useContext, useState} from "react";
import {FireContext} from "../FireContext.tsx";
import {
    BTN_VARIANT,
    type ConfirmDialog,
    type SortArrayConfig,
    type TaskData, type FilterConfig
} from "../types/types.ts";
import Task from "./Task.tsx";
import Modal from "./Modal.tsx";
import TaskEditor from "./TaskEditor.tsx";
import {moveItem} from "../utils/sort.ts";
import {useNavigate} from "react-router";
import {SORT_DIRECTION, SORT_METHOD} from "../constants/sortConstants.ts";
import Filters from "./Filters.tsx";
import Button from "./ui/Button.tsx";
import InputField from "./ui/InputField.tsx";
import Sorting from "./Sorting.tsx";
import {useTasks} from "../hooks/Hooks.tsx";

function Tasks({setConfirmDialog}: { setConfirmDialog: (actions: ConfirmDialog | null) => void }) {
    const {user, taskService} = useContext(FireContext)
    const navigate = useNavigate();
    if (!user) {
        navigate("/login", {replace: true});
        return
    }
    const [editTask, setEditTask] = useState<TaskData | undefined>(undefined);
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig<TaskData>[]>([]);
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "id",
        direction: SORT_DIRECTION.ASC,
        sortMethod: SORT_METHOD.ALPHABETICAL,
    });
    const {
        processedTasks,
        addTask,
        fetchTasks,
        deleteTask,
        updateTask,
        isLoading,
        setIsEditorOpen,
        isEditorOpen
    } = useTasks({user, taskService, search, sortConfig, filtersConfig});

    const handleCreate = () => {
        setEditTask(undefined)
        setIsEditorOpen(true);
    }
    const handleEdit = (task: TaskData) => {
        setEditTask(task);
        setIsEditorOpen(true);
    }
    const confirmDelete = (taskId: string) => {
        setConfirmDialog(
            {
                title: "Delete Task",
                text: "Are you sure you want to delete this task?",
                confirmText: "Delete",
                btnVariant: BTN_VARIANT.DANGER,
                onConfirm: () => {
                    deleteTask(taskId).then(() => setConfirmDialog(null));
                },
                onCancel: () => {
                    setConfirmDialog(null)
                }
            }
        )
    }

    async function moveTaskHandler(task: TaskData, index: number, moveTo: "up" | "down") {
        setSortConfig({...sortConfig, key: "customOrder", sortMethod: SORT_METHOD.NUMERICAL})
        const newOrder = moveItem(processedTasks, index, moveTo, sortConfig.direction)
        if (!newOrder) return
        await updateTask(task.id!, {...task, customOrder: newOrder})
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
            <div className="flex justify-around items-center w-full">
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={handleCreate}>CREATE NEW TASK</Button>
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={fetchTasks}>GET TASKS</Button>
            </div>
            <Filters setFiltersConfig={setFiltersConfig} filtersConfig={filtersConfig}/>
            <Sorting sortConfig={sortConfig} setSortConfig={setSortConfig}>
                <InputField onChange={event => setSearch(event.target.value)} placeholder="Search Tasks">🔍</InputField>
            </Sorting>
            {(isLoading && !processedTasks) &&
              <div className="w-2xl h-96 flex justify-center items-center">Loading...</div>}
            {processedTasks && processedTasks.length > 0 ?
                <div className="flex gap-5 flex-wrap items-start w-full justify-center">
                    {processedTasks.map((task) => (
                        <Task canManuallySort={sortConfig.key === "customOrder"} task={task} tasks={processedTasks}
                              onChangeStatus={(task) => updateTask(task.id!, task)} onDelete={confirmDelete}
                              onEdit={handleEdit} key={task.id} onMove={moveTaskHandler}/>
                    ))}
                </div> : <div className="mt-36 flex flex-col items-center text-2xl">You currently have no tasks</div>}
            {isEditorOpen && <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
              <TaskEditor onCreate={addTask} onEdit={updateTask}
                          onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>}
        </div>
    );
}

export default Tasks;