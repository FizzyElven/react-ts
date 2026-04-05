import {type SortArrayConfig, TASK_PRIORITY, TASK_STATUS} from "../types/types.ts";
import {CUSTOM_SORT_STEP, SORT_DIRECTION, SORT_METHOD, type sortDirection} from "../constants/sortConstants.ts";

export function sortArray<T>(array: T[], sortOptions: SortArrayConfig<T>) {
    if (array.length > 0) {
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

interface moveItemArgs {
    arr: any[] | null,
    currentId: string,
    direction: sortDirection,
    targetId?: string,
    moveDirection?: "up" | "down",
}
export function moveItem({arr, currentId, direction, targetId, moveDirection} : moveItemArgs) {
    if (!arr || arr.length < 2 || (!targetId && !moveDirection)) return
    const currentIndex = arr.findIndex((t) => t.id === currentId)
    let targetIndex = targetId ? arr.findIndex((t) => t.id === targetId) : (moveDirection === 'up' ? currentIndex - 1 : currentIndex + 1);
    const moveTo = targetId ? (currentIndex - targetIndex > 0 ? "up" : "down") : moveDirection
    const newArr = [...arr]
    switch (direction) {
        case SORT_DIRECTION.ASC:
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

export function getNextOrder<T extends {customOrder: number}>(arr: T[]): number {
    if (arr.length === 0) return CUSTOM_SORT_STEP;
    return Math.max(...arr.map(t => t.customOrder)) + CUSTOM_SORT_STEP
}

export function getLogicalOrder(value: string) {
    switch (value) {
        case "priority":
            return Object.values(TASK_PRIORITY)
        case "status":
            return Object.values(TASK_STATUS)
        default:
            break;
    }
}

export function getSortingMethod(value: string) {
    switch (value) {
        case "priority":
        case "status":
            return SORT_METHOD.LOGICAL
        case "createdAt":
        case "dueDate":
        case "customOrder":
            return SORT_METHOD.NUMERICAL
        default:
            return SORT_METHOD.ALPHABETICAL
    }
}