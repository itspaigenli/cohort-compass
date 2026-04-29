import { describe, expect, it } from "vitest";
import {
  formatScheduleDateRange,
  normalizeScheduleItem,
} from "./dateTime.js";

describe("dateTime utilities", () => {
  it("formats timestamp ranges in the requested timezone", () => {
    expect(
      formatScheduleDateRange(
        "2026-05-05T17:00:00.000Z",
        "2026-05-05T18:00:00.000Z",
        "America/Los_Angeles",
      ),
    ).toBe("May 5, 10:00 AM - May 5, 11:00 AM");
  });

  it("preserves date-only events as all-day local calendar dates", () => {
    const item = normalizeScheduleItem(
      {
        id: 1,
        title: "All day cohort work",
        start_time: "2026-05-06",
        end_time: "2026-05-07",
      },
      "America/Los_Angeles",
    );

    expect(item.start_datetime_string).toBe("May 6");
    expect(item.date_and_duration_string).toBe("May 6 · All day");
  });
});
