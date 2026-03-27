import {expect, test} from "vitest";
import {createLogicOrder, moveItem, sortArray} from "./sort.ts"
//must take array of strings and return object where elements of array are props and their indexes are their values
test("CreateLogicOrder", () => {
    expect(createLogicOrder(["a", "b", "c"])).toEqual({
        a: 0,
        b: 1,
        c: 2,
    })
})

test("sortArrayOfObjects", () => {
    expect(sortArray<{username: string}>([
        {username: "a"}, {username: "z"}, {username: "s"}, {username: "c"}],
        {key: "username", sortMethod: "alphabetical", direction: "asc"})).toEqual([{username: "a"}, {username: "c"}, {username: "s"}, {username: "z"}])
    expect(sortArray<{order: number}>([
        {order: 100}, {order: 500}, {order: 350}, {order: 200}
    ], {key: "order", sortMethod: "numerical", direction: "asc"})).toEqual([{order: 100}, {order: 200}, {order: 350}, {order: 500}])
    expect(sortArray<{size: "sm" | "md" | "lg"}>(
        [
            {size: "md"}, {size: "lg"}, {size: "sm"},
        ],{key: "size", sortMethod: "logical", direction: "asc", logicOrder: ["sm", "md", "lg"]}
    )).toEqual([{size: "sm"}, {size: "md"}, {size: "lg"},])
})

test("moveItem", ()=> {
    expect(moveItem([], 2, "up", "asc")).toBe(undefined)
    expect(moveItem([{customOrder: 100}], 0, "up", "asc")).toBe(undefined)
    expect(moveItem([{customOrder: 100}, {customOrder: 200}], 1, "up", "asc")).toBe(50)
    expect(moveItem([{customOrder: 100}, {customOrder: 200}], 0, "down", "asc")).toBe(250)
    expect(moveItem([{customOrder: 200}, {customOrder: 100}], 1, "up", "desc")).toBe(250)
    expect(moveItem([{customOrder: 200}, {customOrder: 100}], 0, "down", "desc")).toBe(50)
})