import type {SortArrayConfig} from "../types/types.ts";

export function sortArray <T>(array: T[], sortOptions: SortArrayConfig<T>) {
    if (array && array.length > 0) {
        return [...array].sort((a, b) => {
            const isAsc = sortOptions.direction === 'asc';
            let comparison = 0;
            switch (sortOptions.sortMethod) {
                case "alphabetical":
                    const aValue = a[sortOptions.key] ?? ""
                    const bValue = b[sortOptions.key] ?? ""
                    console.log("inside switch alphabetical")
                    comparison = String(aValue).localeCompare(String(bValue))
                    break;
                case "numerical":
                    console.log("inside switch num")
                    comparison = Number(a[sortOptions.key]) - Number(b[sortOptions.key])
                    break;
                case "logical":
                    console.log("inside switch logical")
                    if (sortOptions.logicOrder) {
                        const logicMap = createLogicOrder(sortOptions.logicOrder);
                        const aValue = a[sortOptions.key] ?? -1 as any;
                        const bValue = b[sortOptions.key] ?? -1 as any;
                        comparison = logicMap[aValue] - logicMap[bValue];
                        break;
                    }
            }
            return isAsc ? comparison : -comparison;
        })
    }
    return array
}
export function createLogicOrder(order: string[]) : Record<string, number> {
    return order.reduce((acc, value, index)=> {
        acc[value] = index;
        return acc
    }, {} as Record<string, number>)
}