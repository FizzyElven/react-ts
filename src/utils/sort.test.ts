import {expect, test, describe, it} from "vitest";
import {createLogicOrder, getLogicalOrder, getNextOrder, getSortingMethod, moveItem, sortArray} from "./sort.ts"
import {CUSTOM_SORT_STEP, SORT_METHOD} from "../constants/sortConstants.ts";
import {TASK_PRIORITY, TASK_STATUS} from "../types/types.ts";
//must take array of strings and return object where elements of array are properties and their indexes are their values
test("CreateLogicOrder", () => {
    expect(createLogicOrder(["a", "b", "c"])).toEqual({
        a: 0,
        b: 1,
        c: 2,
    })
})

describe("sortArrayOfObjects", () => {
    it("if empty array passed function should return empty array", () => {
        expect(sortArray([], {key: "username", sortMethod: "alphabetical", direction: "asc"})).toEqual([])
    })
    it("sort by key in alphabetical order asc", () => {
        expect(sortArray<{ username: string }>([
                {username: "a"}, {username: "z"}, {username: "s"}, {username: "c"}],
            {
                key: "username",
                sortMethod: "alphabetical",
                direction: "asc"
            })).toEqual([{username: "a"}, {username: "c"}, {username: "s"}, {username: "z"}])
    })
    it("sort by key in alphabetical order desc", () => {
        expect(sortArray<{ username: string }>([
                {username: "a"}, {username: "z"}, {username: "s"}, {username: "c"}],
            {
                key: "username",
                sortMethod: "alphabetical",
                direction: "desc"
            })).toEqual([{username: "z"}, {username: "s"}, {username: "c"}, {username: "a"}])
    })
    it("sort by key in numerical order asc", () => {
        expect(sortArray<{ order: number }>([
            {order: 100}, {order: 500}, {order: 350}, {order: 200}
        ], {
            key: "order",
            sortMethod: "numerical",
            direction: "asc"
        })).toEqual([{order: 100}, {order: 200}, {order: 350}, {order: 500}])
    })
    it("sort by key in numerical order desc", () => {
        expect(sortArray<{ order: number }>([
            {order: 100}, {order: 500}, {order: 350}, {order: 200}
        ], {
            key: "order",
            sortMethod: "numerical",
            direction: "desc"
        })).toEqual([{order: 500}, {order: 350}, {order: 200}, {order: 100}])
    })
    it("sort by key in logical order asc", () => {
        expect(sortArray<{ size: "sm" | "md" | "lg" }>(
            [
                {size: "md"}, {size: "lg"}, {size: "sm"},
            ], {key: "size", sortMethod: "logical", direction: "asc", logicOrder: ["sm", "md", "lg"]}
        )).toEqual([{size: "sm"}, {size: "md"}, {size: "lg"},])
    })
    it("sort by key in logical order desc", () => {
        expect(sortArray<{ size: "sm" | "md" | "lg" }>(
            [
                {size: "md"}, {size: "lg"}, {size: "sm"},
            ], {key: "size", sortMethod: "logical", direction: "desc", logicOrder: ["lg", "md", "sm"]}
        )).toEqual([{size: "sm"}, {size: "md"}, {size: "lg"},])
    })
})

describe("moveItem", () => {
    it("no array should return undefined", () => {
        expect(moveItem({arr: null, currentId: "0", direction: "asc"})).toBe(undefined)
    })
    it("array with less than 2 elements should return undefined", () => {
        expect(moveItem({arr: [{customOrder: 100}], currentId: "0", direction: "asc"})).toBe(undefined)
    })
    it("try to move first object up should return undefined", () => {
        expect(moveItem({arr: [{customOrder: 100, id: "1"}, {customOrder: 200}], currentId: "1", direction: "asc", moveDirection: "up"})).toBe(undefined)
    })
    it("try to move last object down should return undefined", () => {
        expect(moveItem({arr: [{customOrder: 100, id: "0"}, {customOrder: 200, id: "1"}], currentId: "1", direction: "asc", moveDirection: "down"})).toBe(undefined)
    })
    it("moving second element on the first place in asc order need it to have customOrder 50", () => {
        expect(moveItem({arr:[{customOrder: 100, id: "0"}, {customOrder: 200, id: "1"}], currentId:"1", moveDirection:"up", direction:"asc"})).toBe(50)
    })
    it("moving first element on the second place in asc need it to have customOrder 250", () => {
        expect(moveItem({arr:[{customOrder: 100, id: "0"}, {customOrder: 200, id: "1"}], currentId:"0", moveDirection:"down", direction:"asc"})).toBe(250)
    })
    it("moving first element on the second place in desc need it to have customOrder 50", () => {
        expect(moveItem({arr:[{customOrder: 200, id: "1"}, {customOrder: 100, id: "0"}], currentId:"1", moveDirection:"down", direction:"desc"})).toBe(50)
    })
    it("moving second element on the first place in asc order need it to have customOrder 250", () => {
        expect(moveItem({arr:[{customOrder: 200, id: "1"}, {customOrder: 100, id: "0"}], currentId:"0", moveDirection:"up", direction:"desc"})).toBe(250)
    })
    it("moving third element on the first place in asc order need it to have customOrder 50", () => {
        expect(moveItem({arr:[{customOrder: 100, id: "0"}, {customOrder: 200, id: "1"}, {customOrder: 300, id: "2"}], currentId:"2", targetId: "0", direction:"asc"})).toBe(50)
    })
    it("moving first element on the third place in asc need it to have customOrder 250", () => {
        expect(moveItem({arr:[{customOrder: 100, id: "0"}, {customOrder: 200, id: "1"}, {customOrder: 300, id: "2"}], currentId:"0", targetId: "2", direction:"asc"})).toBe(350)
    })
    it("moving first element on the third place in desc need it to have customOrder 50", () => {
        expect(moveItem({arr:[{customOrder: 300, id: "2"}, {customOrder: 200, id: "1"}, {customOrder: 100, id: "0"}], currentId:"2", targetId: "0", direction:"desc"})).toBe(50)
    })
    it("moving third element on the first place in asc order need it to have customOrder 250", () => {
        expect(moveItem({arr:[{customOrder: 300, id: "2"}, {customOrder: 200, id: "1"}, {customOrder: 100, id: "0"}], currentId:"0", targetId: "2", direction:"desc"})).toBe(350)
    })
})

describe("getNextOrder", () => {
    it("returns CUSTOM_SORT_STEP", () => {
        expect(getNextOrder([])).toBe(CUSTOM_SORT_STEP)
    })
    it("returns max order + CUSTOM_SORT_STEP", () => {
        expect(getNextOrder<{ id: number, customOrder: number }>([{id: 1, customOrder: 200}, {
            id: 2,
            customOrder: 400
        }])).toBe(500)
    })
})
describe("getLogicalOrder()", () => {
    it("should return Object.values(TASK_PRIORITY)", () => {
        expect(getLogicalOrder("priority")).toEqual(Object.values(TASK_PRIORITY))
    })
    it("should return Object.values(TASK_STATUS)", () => {
        expect(getLogicalOrder("status")).toEqual(Object.values(TASK_STATUS))
    })
    it("should return undefined", () => {
        expect(getLogicalOrder("id")).toBe(undefined)
    })
})
describe("getSortingMethod()", () => {
    it("should return SORT_METHOD.LOGICAL", () => {
        expect(getSortingMethod("priority")).toBe(SORT_METHOD.LOGICAL)
        expect(getSortingMethod("status")).toBe(SORT_METHOD.LOGICAL)
    })
    it("should return SORT_METHOD.NUMERICAL", () => {
        expect(getSortingMethod("createdAt")).toBe(SORT_METHOD.NUMERICAL)
        expect(getSortingMethod("dueDate")).toBe(SORT_METHOD.NUMERICAL)
        expect(getSortingMethod("customOrder")).toBe(SORT_METHOD.NUMERICAL)
    })
    it("should return SORT_METHOD.ALPHABETICAL", () => {
        expect(getSortingMethod("id")).toBe(SORT_METHOD.ALPHABETICAL)
    })
})