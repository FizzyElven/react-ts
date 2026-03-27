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

function Filters({setFiltersConfig, filtersConfig}: {
    setFiltersConfig: (...params: any[]) => void,
    filtersConfig: FilterConfig<TaskData>[]
}) {
    const [dropDownOpen, setDropDownOpen] = useState<FilterType | null>(null);

    function addFilter(field: FilterType, value: any = null) {
        if (field === FILTERS.OTHER) {
            setFiltersConfig([
                ...filtersConfig,
                {
                    field,
                    value,
                },
            ])
        }
            const arr = filtersConfig.filter(el => el.field !== field)
            setFiltersConfig([...arr, { field, value }])
    }

    function removeFilter(field: keyof TaskData, value: any) {
            setFiltersConfig(filtersConfig.filter(el => el.field !== field && el.value !== value));
    }

    return (
        <>
        <div className="flex gap-5">
            {filtersArray.map(filter => (
                <div key={filter.filterCategory} className="relative" >
                    <div className="relative h-10 flex transition justify-center items-center rounded-full border border-blue-500 shadow-lg shadow-gray-200 hover:border-blue-600 hover:shadow-lg hover:bg-gray-50 px-5 text-2xl"
                         onMouseEnter={() => setDropDownOpen(filter.filterCategory)}>
                        {filter.filterCategory}
                    </div>
                    {dropDownOpen === filter.filterCategory &&
                      <div className="absolute z-50 border border-blue-500 top-12 bg-white text-2xl p-2.5 shadow-2xl shadow-gray-400 rounded-lg w-40 flex flex-col"
                           onMouseLeave={() => setDropDownOpen(null)}>
                          {filter.options.map(option => (
                              <div key={option} className="flex items-center gap-2.5">
                                  <input className="size-4" id={option} type="checkbox" value={option}
                                         checked={filtersConfig.some(el => el.field === filter.filterCategory && el.value === option)}
                                         onChange={(event) => {
                                             event.target.checked ? addFilter(filter.filterCategory as FilterType, option) : removeFilter(filter.filterCategory as keyof TaskData, option)
                                         }}/>
                                  <label htmlFor={option}>{option}</label>
                              </div>
                          ))}
                      </div>}
                </div>
            ))}
        </div>
            {filtersConfig.length > 0 && <div className="flex gap-2.5 text-xl">
                {filtersConfig.map(filter => {
                    return (
                        <button key={filter.value} onClick={()=>removeFilter(filter.field as keyof TaskData, filter.value)} className="leading-none rounded-full p-2.5 flex gap-2 items-center border border-blue-500 shadow-lg shadow-gray-200">
                            {`${filter.field}: ${filter.value} ×`}
                        </button>
                    )
                })}
              <button className="text-xl h-10 flex justify-center items-center rounded-full border border-blue-500 shadow-lg shadow-gray-200 hover:border-blue-600 hover:shadow-lg hover:bg-gray-50 px-5"
                      onClick={() => setFiltersConfig([])}>
                Clear Filters
              </button>
            </div>}
        </>
    );
}

export default Filters;