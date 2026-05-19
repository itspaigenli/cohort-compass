import { describe, expect, it } from "vitest";
import { parseDueAt, parseReminderId } from "../src/utils/reminderParsers.js";

describe("reminder parsers", () => {
  describe("parseReminderId", () => {
    it("returns a positive integer id", () => {
      // Arrange
      // The parser receives route parameter values.

      // Act
      const stringId = parseReminderId("12");
      const numberId = parseReminderId(7);

      // Assert
      expect(stringId).toBe(12);
      expect(numberId).toBe(7);
    });

    it("returns null for invalid ids", () => {
      // Arrange
      // Invalid ids can come from malformed route parameters.

      // Act
      const invalidIds = ["abc", "1.5", "0", "-2"].map((id) => parseReminderId(id));

      // Assert
      expect(invalidIds).toEqual([null, null, null, null]);
    });
  });

  describe("parseDueAt", () => {
    it("normalizes empty values to null", () => {
      // Arrange
      // Empty due dates are allowed for reminders.

      // Act
      const emptyValues = [undefined, null, ""].map((value) => parseDueAt(value));

      // Assert
      expect(emptyValues).toEqual([
        { ok: true, value: null },
        { ok: true, value: null },
        { ok: true, value: null },
      ]);
    });

    it("returns an ISO timestamp for valid date strings", () => {
      // Arrange
      const dueAt = "2026-04-30T12:00:00.000Z";

      // Act
      const result = parseDueAt(dueAt);

      // Assert
      expect(result).toEqual({
        ok: true,
        value: "2026-04-30T12:00:00.000Z",
      });
    });

    it("rejects invalid due date values", () => {
      // Arrange
      // Invalid dates should not be saved.

      // Act
      const invalidDates = [
        "not a date",
        "2026-04-30",
        "2026-02-31",
        "2026-04-30T25:00:00.000Z",
        123,
      ].map((value) => parseDueAt(value));

      // Assert
      expect(invalidDates).toEqual([
        { ok: false },
        { ok: false },
        { ok: false },
        { ok: false },
        { ok: false },
      ]);
    });
  });
});
