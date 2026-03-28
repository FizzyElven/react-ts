export function searchInArray<T, K extends keyof T>(arr: T[], value: string, keysToCheck: K[]) {
    if (arr.length < 1) return []
    if (!value || keysToCheck.length < 1) return arr
    return [...arr].filter(el => {
        return keysToCheck.some(key => {
            if (typeof el[key] !== "string") return false;
            return (el[key].toLowerCase().includes(value.toLowerCase()))
        })
    })
}