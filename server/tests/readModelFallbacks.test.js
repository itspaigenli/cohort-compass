import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkDatabaseConnection, query } from "../src/config/db.js";
import {
  fallbackFaqEntries,
  fallbackLinks,
  fallbackReminders,
  fallbackScheduleItems,
} from "../src/lib/fallbackData.js";
import { listFaqEntries } from "../src/models/faqModel.js";
import { listLinks } from "../src/models/linksModel.js";
import { listReminders } from "../src/models/remindersModel.js";
import { listScheduleItems } from "../src/models/scheduleModel.js";

vi.mock("../src/config/db.js", () => ({
  checkDatabaseConnection: vi.fn(),
  query: vi.fn(),
}));

describe("read model fallbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fallback data when the database is unavailable", async () => {
    checkDatabaseConnection.mockResolvedValue(false);

    await expect(listFaqEntries()).resolves.toBe(fallbackFaqEntries);
    await expect(listLinks()).resolves.toBe(fallbackLinks);
    await expect(listScheduleItems()).resolves.toBe(fallbackScheduleItems);
    await expect(listReminders()).resolves.toBe(fallbackReminders);
    expect(query).not.toHaveBeenCalled();
  });

  it("queries data when the database is available", async () => {
    const rows = [{ id: 1, title: "From database" }];

    checkDatabaseConnection.mockResolvedValue(true);
    query.mockResolvedValue({ rows });

    await expect(listFaqEntries()).resolves.toBe(rows);
    await expect(listLinks()).resolves.toBe(rows);
    await expect(listScheduleItems()).resolves.toBe(rows);
    await expect(listReminders()).resolves.toBe(rows);
    expect(query).toHaveBeenCalledTimes(4);
  });
});
