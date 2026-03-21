
export function searchInArray<T, K extends keyof T>(arr: T[], value: string, keysToCheck: K[]) {
    return [...arr].filter(el => {
        return keysToCheck.some(key => {
            if (typeof el[key] !== "string") return false;
            return (el[key].includes(value))
        })
    })
}