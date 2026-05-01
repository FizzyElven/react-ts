import {useState} from "react";
import {
    type FilterConfig,
    FILTERS,
    type FilterType,
    TASK_PRIORITY,
    TASK_STATUS,
    type TaskData
} from "../types/types.ts";

const filtersArray = [{
    filterCategory: FILTERS.STATUS,
    options: Object.values(TASK_STATUS)
}, {filterCategory: FILTERS.PRIORITY, options: Object.values(TASK_PRIORITY)}, {
    filterCategory: FILTERS.OTHER,
    options: ["dueDate"]
}];

interface Props {
    setFiltersConfig: (...params: any[]) => void;
    filtersConfig: FilterConfig<TaskData>[];
    addFilter: (field: FilterType, value: string) => void;
    removeFilter: (field: keyof TaskData, value: any) => void;
}

function Filters({setFiltersConfig, filtersConfig, addFilter, removeFilter}: Props) {
    const [dropDownOpen, setDropDownOpen] = useState<FilterType | null>(null);

    return (
        <>
            <div className="flex gap-5">
                {filtersArray.map(filter => {
                    const triggerId = `filter-${filter.filterCategory}`;

                    return (
                        <div key={filter.filterCategory} className="relative" onMouseLeave={() => setDropDownOpen(null)}
                             onBlur={(e) => {
                                 if (!e.currentTarget.contains(e.relatedTarget)) setDropDownOpen(null)
                             }}
                             onKeyDown={(e) => {
                                 if (e.key === "Escape") {
                                     setDropDownOpen(null)
                                     e.currentTarget.focus()
                                 }
                             }}>
                            <button
                                id={triggerId}
                                aria-label={`Filter ${filter.filterCategory}`}
                                aria-haspopup="true"
                                aria-expanded={true}
                                className="relative h-10 flex transition justify-center items-center rounded-full border border-blue-500 bg-white shadow-lg px-5 text-2xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none dark:bg-gray-900 dark:border-blue-400 dark:shadow-gray-950 dark:hover:bg-gray-800"
                                onClick={() => setDropDownOpen(dropDownOpen === filter.filterCategory ? null : filter.filterCategory)}
                                onMouseEnter={() => setDropDownOpen(filter.filterCategory)}
                            >
                                {filter.filterCategory}
                            </button>

                            {dropDownOpen === filter.filterCategory && (
                                <section
                                    role="region"
                                    aria-labelledby={triggerId}
                                    className="absolute z-50 p-3"
                                    onMouseLeave={() => setDropDownOpen(null)}
                                >
                                    <ul className="bg-white border border-blue-500 shadow-2xl p-2.5 rounded-lg w-40 text-2xl flex flex-col gap-2.5 list-none dark:bg-gray-900 dark:border-blue-400">
                                        {filter.options.map(option => {
                                            const uniqueId = `${filter.filterCategory}-${option}`;
                                            return (
                                                <li key={option} className="flex items-center gap-2.5">
                                                    <input
                                                        className="size-4"
                                                        id={uniqueId}
                                                        type="checkbox"
                                                        value={option}
                                                        checked={filtersConfig.some(el => el.field === filter.filterCategory && el.value === option)}
                                                        onChange={(e) => e.target.checked
                                                            ? addFilter(filter.filterCategory as FilterType, option)
                                                            : removeFilter(filter.filterCategory as keyof TaskData, option)
                                                        }
                                                    />
                                                    <label htmlFor={uniqueId}>{option}</label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            )}
                        </div>
                    );
                })}
            </div>
            {filtersConfig.length > 0 && <div className="flex gap-2.5 text-xl">
                {filtersConfig.map(filter => {
                    return (
                        <button key={filter.value} aria-label={`remove filter ${filter.field}: ${filter.value}`}
                                onClick={() => removeFilter(filter.field as keyof TaskData, filter.value)}
                                className="leading-none rounded-full p-2.5 flex gap-2 items-center border border-blue-500 bg-white shadow-lg shadow-gray-200 dark:bg-gray-900 dark:border-blue-400 dark:shadow-gray-950">
                            {`${filter.field}: ${filter.value} ×`}
                        </button>
                    )
                })}
              <button
                className="text-xl h-10 flex justify-center items-center rounded-full border border-blue-500 bg-white shadow-lg shadow-gray-200 hover:border-blue-600 hover:shadow-lg hover:bg-gray-50 px-5 dark:bg-gray-900 dark:border-blue-400 dark:shadow-gray-950 dark:hover:bg-gray-800"
                onClick={() => setFiltersConfig([])}>
                Clear Filters
              </button>
            </div>}
        </>
    );
}

export default Filters;
