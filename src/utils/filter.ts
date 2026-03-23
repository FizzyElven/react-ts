import {type FilterConfig, FILTERS} from "../types/types.ts";

export function filterArray<T extends {}>(array: T[], filters: FilterConfig<T>[]) {
    if (array.length > 0 && filters.length > 0) {
        return [...array].filter(item => {
            return filters.every((filter) => {
                if (filter.field === FILTERS.OTHER) {
                    return item.hasOwnProperty(filter.value)
                }
                return item[filter.field as keyof T] === filter.value
            })
        })
    }
    return array
}