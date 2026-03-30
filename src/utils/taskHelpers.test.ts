import {describe, expect, it} from "vitest";
import {TASK_PRIORITY, TASK_STATUS} from "../types/types.ts";
import {getBorderColor, getPriorityBar, getStatusEmoji} from "./taskHelpers.ts";

describe("getBorderColor()", () => {
    it("should return border-grey-600", () => {
        expect(getBorderColor(TASK_STATUS.IDLE)).toBe("border-grey-600")
    })
    it("should return border-blue-600", () => {
        expect(getBorderColor(TASK_STATUS.ACTIVE)).toBe("border-blue-600")
    })
    it("should return border-green-600", () => {
        expect(getBorderColor(TASK_STATUS.COMPLETED)).toBe("border-green-600")
    })
    it("should return border-red-600", () => {
        expect(getBorderColor(TASK_STATUS.OVERDUE)).toBe("border-red-600")
    })
})

describe("getStatusEmoji()", () => {
    it("should return 😴", () => {
        expect(getStatusEmoji(TASK_STATUS.IDLE)).toBe("😴")
    })
    it("should return ⚡", () => {
        expect(getStatusEmoji(TASK_STATUS.ACTIVE)).toBe("⚡")
    })
    it("should return ✔️", () => {
        expect(getStatusEmoji(TASK_STATUS.COMPLETED)).toBe("✔️")
    })
    it("should return ❌", () => {
        expect(getStatusEmoji(TASK_STATUS.OVERDUE)).toBe("❌")
    })
})
describe("getPriorityBar()", () => {
    it("should return left-3.75", () => {
        expect(getPriorityBar(TASK_PRIORITY.LOW)).toBe("left-3.75")
    })
    it("should return left-11", () => {
        expect(getPriorityBar(TASK_PRIORITY.MEDIUM)).toBe("left-11")
    })
    it("should return right-1.5", () => {
        expect(getPriorityBar(TASK_PRIORITY.HIGH)).toBe("right-1.5")
    })
})