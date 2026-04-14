import {type SortArrayConfig, type TaskData} from "../types/types.ts";
import type {ChangeEvent, ReactNode} from "react";
import {SORT_DIRECTION} from "../constants/sortConstants.ts";
import {getLogicalOrder, getSortingMethod} from "../utils/sort.ts";

function Sorting({sortConfig, setSortConfig, children}: {
    sortConfig: SortArrayConfig<TaskData>
    setSortConfig: (...params: any[]) => void,
    children: ReactNode,
}) {
    const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortConfig({
            key: event.target.value as keyof TaskData,
            direction: SORT_DIRECTION.ASC,
            sortMethod: getSortingMethod(event.target.value),
            logicOrder: getLogicalOrder(event.target.value),
        })
    }
    return (
        <div className="flex items-center gap-2.5">
            {children}
            <div className="group shadow-lg transition shadow-gray-200 hover:border-blue-400
                    focus-within:border-blue-300 focus-within:shadow-lg border-2 border-blue-600 rounded-full px-2 text-2xl p-2.5 flex gap-2.5">
                <label className="sr-only" htmlFor="task-sort-select">Select how to sort tasks</label>
                <select id="task-sort-select"
                    className="outline-none"
                    name="sorting tasks" value={sortConfig.key}
                    onChange={handleSorting}>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Creation time</option>
                    <option value="customOrder">Custom order</option>
                </select>
            </div>
            <button aria-label={`Sort ${sortConfig.direction === "asc" ? "descending" : "ascending"}`}
                className="cursor-pointer font-bold border border-blue-500 transition shadow-lg shadow-gray-200 hover:border-blue-400 hover:border-2 w-10 h-10
                    focus-within:border-blue-300 focus-within:shadow-lg rounded-full px-2 text-2xl p-2.5 flex gap-2.5"
                onClick={() => setSortConfig((prevState: { direction: string; }) => {
                    return {
                        ...prevState,
                        direction: prevState.direction === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                    }
                })}><p
                className={"duration-300 transition-transform text-3xl w-full h-full leading-none flex items-center justify-center " + `${sortConfig.direction === SORT_DIRECTION.ASC ? "rotate-180" : "rotate-0"}`}>↓</p>
            </button>
        </div>
    );
}

export default Sorting;