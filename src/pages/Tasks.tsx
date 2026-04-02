import {useContext, useState} from "react";
import {FireContext} from "../FireContext.tsx";
import {BTN_VARIANT, type SortArrayConfig, type TaskData} from "../types/types.ts";
import Task from "../components/Task.tsx";
import Modal from "../components/Modal.tsx";
import TaskEditor from "../components/TaskEditor.tsx";
import {useNavigate} from "react-router";
import {SORT_DIRECTION, SORT_METHOD} from "../constants/sortConstants.ts";
import Filters from "../components/Filters.tsx";
import Button from "../components/ui/Button.tsx";
import InputField from "../components/ui/InputField.tsx";
import Sorting from "../components/Sorting.tsx";
import {useFilters, useTasks} from "../hooks/Hooks.tsx";
import {useConfirm} from "../ConfirmContext.tsx";

function Tasks() {
    const {user, taskService} = useContext(FireContext)
    const navigate = useNavigate();
    if (!user) {
        navigate("/login", {replace: true});
        return
    }
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "id",
        direction: SORT_DIRECTION.ASC,
        sortMethod: SORT_METHOD.ALPHABETICAL,
    });
    const {filtersConfig, setFiltersConfig, removeFilter, addFilter} = useFilters()
    const {
        processedTasks,
        addTask,
        fetchTasks,
        deleteTask,
        updateTask,
        moveTask,
        isLoading,
        setIsEditorOpen,
        isEditorOpen,
        handleEditTask,
        handleCreateTask,
        editTask,
    } = useTasks({user, taskService, search, sortConfig, filtersConfig});
    const confirm = useConfirm()
    const confirmDeleteTask = (taskId: string) => {
        confirm(
            {
                title: "Delete Task",
                text: "Are you sure you want to delete this task?",
                confirmText: "Delete",
                btnVariant: BTN_VARIANT.DANGER,
                onConfirm: () => deleteTask(taskId),
            }
        )
    }

    return (
        <div className="container mx-auto mt-5 flex flex-col items-center gap-5">
            <div className="flex justify-around items-center w-full">
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={handleCreateTask}>CREATE NEW TASK</Button>
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={fetchTasks}>GET TASKS</Button>
            </div>
            <Filters setFiltersConfig={setFiltersConfig} filtersConfig={filtersConfig} addFilter={addFilter}
                     removeFilter={removeFilter}/>
            <Sorting sortConfig={sortConfig} setSortConfig={setSortConfig}>
                <InputField onChange={event => setSearch(event.target.value)} placeholder="Search Tasks">🔍</InputField>
            </Sorting>
            {(isLoading && !processedTasks) &&
              <div className="w-2xl h-96 flex justify-center items-center">Loading...</div>}
            {processedTasks && processedTasks.length > 0 ?
                <div className="flex gap-5 flex-wrap items-start w-full justify-center">
                    {processedTasks.map((task) => (
                        <Task canManuallySort={sortConfig.key === "customOrder"} task={task} tasks={processedTasks}
                              onChangeStatus={(task) => updateTask(task.id!, task)} onDelete={confirmDeleteTask}
                              onEdit={handleEditTask} key={task.id} onMove={moveTask}/>
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