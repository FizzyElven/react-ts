import {filterArray} from "./filter.ts"
import {describe, expect, it} from "vitest";

describe("filterArray", () => {
    it("if empty array is provided, should return provided array", ()=> {
        expect(filterArray([], [{}])).toEqual([])
    })
    it("if empty array of filters is provided, should return provided array", ()=> {
        expect(filterArray([{id: 111}], [])).toEqual([{id: 111}])
    })
    it("if all filters passed, object should be in returned array", ()=> {
        expect(filterArray([{id: 123}], [{field: "id", value: 123}])).toEqual([{id: 123}])
    })
    it("if at least one filter not passed, object should filtered", ()=> {
        expect(filterArray([{id: 123, name: "Sam"}], [{field: "id", value: 123}, {field: "name", value: "Alice"}])).toEqual([])
    })
    it("if filter.field is other, object with properties that specified in filter.value must be in resulting array", ()=> {
        expect(filterArray([{id: 123, name: "Sam"}], [{field: "other", value: "id"}, {field: "other", value: "name"}])).toEqual([{id: 123, name: "Sam"}])
    })
})