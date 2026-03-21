export const CUSTOM_SORT_STEP = 100
export const SORT_METHOD = {
    NUMERICAL: "numerical",
    ALPHABETICAL: "alphabetical",
    LOGICAL: "logical",
} as const;
export type SortMethod = (typeof SORT_METHOD)[keyof typeof SORT_METHOD];
export const SORT_DIRECTION = {
    ASC: "asc",
    DESC: "desc",
} as const;
export type sortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
