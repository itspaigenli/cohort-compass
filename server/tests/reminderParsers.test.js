import { describe, expect, it } from "vitest";
import { parseDueAt, parseReminderId } from "../src/utils/reminderParsers.js";

describe("reminder parsers", () => {
  describe("parseReminderId", () => {
    it("returns a positive integer id", () => {
      expect(parseReminderId("12")).toBe(12);
      expect(parseReminderId(7)).toBe(7);
    });

    it("returns null for invalid ids", () => {
      expect(parseReminderId("abc")).toBeNull();
      expect(parseReminderId("1.5")).toBeNull();
      expect(parseReminderId("0")).toBeNull();
      expect(parseReminderId("-2")).toBeNull();
    });
  });

  describe("parseDueAt", () => {
    it("normalizes empty values to null", () => {
      expect(parseDueAt(undefined)).toEqual({ ok: true, value: null });
      expect(parseDueAt(null)).toEqual({ ok: true, value: null });
      expect(parseDueAt("")).toEqual({ ok: true, value: null });
    });

    it("returns an ISO timestamp for valid date strings", () => {
      expect(parseDueAt("2026-04-30T12:00:00.000Z")).toEqual({
        ok: true,
        value: "2026-04-30T12:00:00.000Z",
      });
    });

    it("rejects invalid due date values", () => {
      expect(parseDueAt("not a date")).toEqual({ ok: false });
      expect(parseDueAt("2026-04-30")).toEqual({ ok: false });
      expect(parseDueAt("2026-02-31")).toEqual({ ok: false });
      expect(parseDueAt("2026-04-30T25:00:00.000Z")).toEqual({ ok: false });
      expect(parseDueAt(123)).toEqual({ ok: false });
    });
  });
});
