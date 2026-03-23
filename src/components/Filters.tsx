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
        <div className="flex gap-2.5">
            {filtersArray.map(filter => (
                <div key={filter.filterCategory}>
                    <div className="relative"
                         onMouseEnter={() => setDropDownOpen(filter.filterCategory)}>
                        {filter.filterCategory}
                    </div>
                    {dropDownOpen === filter.filterCategory &&
                      <div className="absolute border-2 border-blue-600 bottom"
                           onMouseLeave={() => setDropDownOpen(null)}>
                          {filter.filterCategory}
                          {filter.options.map(option => (
                              <div key={option}>
                                  <input id={option} type="checkbox" value={option}
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
    );
}

export default Filters;