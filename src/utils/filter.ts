import {type FilterConfig} from "../types/types.ts";

export function filterArray<T extends {}>(array: T[], filters: FilterConfig<T>[]) {
    if (array.length > 0 && filters.length > 0) {
        return [...array].filter(item => {
            return filters.every((filter) => {
                if (filter.value in item) {
                    return item[filter.value as keyof typeof item];
                }
                return item[filter.field as keyof T] === filter.value
            })
        })
    }
    return array
}