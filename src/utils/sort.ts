import type {SortArrayConfig} from "../types/types.ts";
import {CUSTOM_SORT_STEP, SORT_DIRECTION, SORT_METHOD, type sortDirection} from "../constants/sortConstants.ts";

export function sortArray<T>(array: T[], sortOptions: SortArrayConfig<T>) {
    if (array && array.length > 0) {
        return [...array].sort((a, b) => {
            const isAsc = sortOptions.direction === SORT_DIRECTION.ASC;
            let comparison = 0;
            switch (sortOptions.sortMethod) {
                case SORT_METHOD.ALPHABETICAL:
                    const aValue = a[sortOptions.key] ?? ""
                    const bValue = b[sortOptions.key] ?? ""
                    comparison = String(aValue).localeCompare(String(bValue))
                    break;
                case SORT_METHOD.NUMERICAL:
                    comparison = Number(a[sortOptions.key]) - Number(b[sortOptions.key])
                    break;
                case SORT_METHOD.LOGICAL:
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

export function createLogicOrder(order: string[]): Record<string, number> {
    return order.reduce((acc, value, index) => {
        acc[value] = index;
        return acc
    }, {} as Record<string, number>)
}

export function moveItem(arr: any[] | null, currentIndex: number, moveTo: "up" | "down", direction: sortDirection) {
    if (!arr || arr.length < 2) return
    const newArr = [...arr]
    let targetIndex: number;
    switch (direction) {
        case SORT_DIRECTION.ASC:
            targetIndex = moveTo === 'up' ? currentIndex - 1 : currentIndex + 1
            if (targetIndex < 0 || targetIndex >= newArr.length) return;
            if (moveTo === 'up') {
                const prevNeighbor = newArr[targetIndex - 1]?.customOrder ?? 0;
                const nextNeighbor = newArr[targetIndex].customOrder;
                return (prevNeighbor + nextNeighbor) / 2;
            } else {
                const prevNeighbor = newArr[targetIndex].customOrder;
                const nextNeighbor = newArr[targetIndex + 1]?.customOrder ?? prevNeighbor + CUSTOM_SORT_STEP;
                return (prevNeighbor + nextNeighbor) / 2;
            }
        case SORT_DIRECTION.DESC:
            targetIndex = moveTo === 'up' ? currentIndex - 1 : currentIndex + 1
            if (targetIndex < 0 || targetIndex >= newArr.length) return;
            if (moveTo === 'up') {
                const prevNeighbor = newArr[targetIndex].customOrder;
                const nextNeighbor = newArr[targetIndex - 1]?.customOrder ?? prevNeighbor + CUSTOM_SORT_STEP;
                return (prevNeighbor + nextNeighbor) / 2;
            } else {
                const prevNeighbor = newArr[targetIndex + 1]?.customOrder ?? 0;
                const nextNeighbor = newArr[targetIndex].customOrder;
                return (prevNeighbor + nextNeighbor) / 2;
            }
    }
}