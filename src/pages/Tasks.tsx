import {useContext, useState} from "react";
import {AuthContext} from "../AuthContext.tsx";
import {BTN_VARIANT, type SortArrayConfig, type TaskData} from "../types/types.ts";
import {SortableTaskItem} from "../components/Task.tsx";
import Modal from "../components/Modal.tsx";
import TaskEditor from "../components/TaskEditor.tsx";
import {SORT_DIRECTION, SORT_METHOD} from "../constants/sortConstants.ts";
import Filters from "../components/Filters.tsx";
import Button from "../components/ui/Button.tsx";
import InputField from "../components/ui/InputField.tsx";
import Sorting from "../components/Sorting.tsx";
import {useFilters, useTasks} from "../hooks/Hooks.tsx";
import {useConfirm} from "../ConfirmContext.tsx";
import {DndContext, closestCenter} from '@dnd-kit/core';
import {SortableContext, rectSortingStrategy, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {type DragEndEvent, useSensor, useSensors, KeyboardSensor, PointerSensor} from "@dnd-kit/core";
import {moveItem} from "../utils/sort.ts";

function Tasks() {
    const {user, taskService} = useContext(AuthContext)
    if (!user) return <div>Something went wrong</div>
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates, // <-- This is the magic line
        })
    );
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortArrayConfig<TaskData>>({
        key: "title",
        direction: SORT_DIRECTION.ASC,
        sortMethod: SORT_METHOD.ALPHABETICAL,
    });
    const {filtersConfig, setFiltersConfig, removeFilter, addFilter} = useFilters()
    const {
        processedTasks,
        setTasks,
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
        error,
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

    async function handleDragEnd(event: DragEndEvent) {
        if (!processedTasks) return
        const {active, over} = event;
        if (over && active.id !== over.id ) {
            const newOrderValue = moveItem({arr: processedTasks, currentId: active.id.toString(), direction: sortConfig.direction, targetId: over.id.toString()});
            if (!newOrderValue) return
            const activeTaskIndex = processedTasks.findIndex((t) => t.id === active.id)
            const activeTask = {...processedTasks[activeTaskIndex]}
            const arr = processedTasks.filter((t) => t.id !== active.id)
            setTasks([...arr, {...activeTask, customOrder: newOrderValue}])
            updateTask(active.id.toString(), {...activeTask, customOrder: newOrderValue}).catch(() => {
                setTasks(processedTasks);
            });
        }
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
                <InputField label="Search task" hiddenLabel={true} onChange={event => setSearch(event.target.value)} placeholder="Search Tasks">🔍</InputField>
            </Sorting>
            {(isLoading && !processedTasks) &&
              <div className="w-2xl h-96 flex justify-center items-center">Loading...</div>}
            {processedTasks && processedTasks.length > 0 ?
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e)}>
                    <SortableContext items={processedTasks} strategy={rectSortingStrategy}>
                        <div role="list" className="gap-5 w-full grid grid-cols-4">
                            {processedTasks.map((task) => (
                                <SortableTaskItem canManuallySort={sortConfig.key === "customOrder"} task={task}
                                                  tasks={processedTasks} error={error}
                                                  onChangeStatus={(task) => updateTask(task.id!, task)}
                                                  onDelete={confirmDeleteTask}
                                                  onEdit={handleEditTask} key={task.id} onMove={moveTask}/>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext> :
                <div className="mt-36 flex flex-col items-center text-2xl">You currently have no tasks
                    {(error && error.errorScope === "get") && <div className="text-red-500">failed to get tasks: {error.message}</div>}
                </div>}
            {isEditorOpen && <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
              <TaskEditor onCreate={addTask} onEdit={updateTask} error={error}
                          onCancel={() => setIsEditorOpen(false)} initialTask={editTask}/>
            </Modal>}
        </div>
    );
}

export default Tasks;