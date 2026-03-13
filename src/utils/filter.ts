export function filterArray<T>(array: T[], filters: Partial<T>) {
    if (array && array.length > 0) {
        return [...array].filter(item => {
            return Object.keys(filters).every((key) => {
                return item[key as keyof T] === filters[key as keyof T]
            })
        })
    }
    return array
}