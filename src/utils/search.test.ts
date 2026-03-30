import {searchInArray} from "./search.ts"
import {describe, expect, it} from "vitest";

describe("searchInArray", () => {
    it("if array is empty, should return an empty array", () => {
        expect(searchInArray([], "", [])).toEqual([])
    })
    it("if value is falsy, should return an passed array", () => {
        expect(searchInArray<{ name: string }, "name">([{name: "Alice"}], "", ["name"])).toEqual([{name: "Alice"}])
    })
    it("if keyToCheck array is empty, should return an passed array", () => {
        expect(searchInArray([""], "a", [])).toEqual([""])
    })
    it("if object dont have properties with string values, should be filtered", () => {
        expect(searchInArray<{ id: number }, "id">([{id: 11111}], "11111", ["id"])).toEqual([])
    })
    it("if object property includes value, then it should be in returned array", () => {
        expect(searchInArray<{
            name: string
        }, "name">([{name: "Alice"}, {name: "Alex"}], "Al", ["name"])).toEqual([{name: "Alice"}, {name: "Alex"}])
    })
    it("if object property not includes value, then it should filtered", () => {
        expect(searchInArray<{
            name: string
        }, "name">([{name: "Alice"}, {name: "Alex"}], "x", ["name"])).toEqual([{name: "Alex"}])
    })
})