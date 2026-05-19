import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import {
  createReminder,
  deleteReminder,
  listReminders,
  updateReminder,
} from "../src/models/remindersModel.js";

vi.mock("../src/models/remindersModel.js", () => ({
  createReminder: vi.fn(),
  deleteReminder: vi.fn(),
  listReminders: vi.fn(),
  updateReminder: vi.fn(),
}));

describe("/api/reminders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns reminders from the reminders model", async () => {
    // Arrange
    const reminders = [{ id: 1, text: "Review notes", done: false }];

    listReminders.mockResolvedValue(reminders);

    // Act
    const response = await request(app).get("/api/reminders");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ reminders });
  });

  it("creates a reminder", async () => {
    // Arrange
    const reminder = { id: 1, text: "Review notes", done: false };

    createReminder.mockResolvedValue(reminder);

    // Act
    const response = await request(app)
      .post("/api/reminders")
      .send({ text: "Review notes" });

    // Assert
    expect(response.status).toBe(201);
    expect(createReminder).toHaveBeenCalledWith({
      text: "Review notes",
      due_at: null,
    });
    expect(response.body).toEqual({ reminder });
  });

  it("updates a reminder", async () => {
    // Arrange
    const reminder = { id: 1, text: "Review notes", done: true };

    updateReminder.mockResolvedValue(reminder);

    // Act
    const response = await request(app)
      .patch("/api/reminders/1")
      .send({ done: true });

    // Assert
    expect(response.status).toBe(200);
    expect(updateReminder).toHaveBeenCalledWith(1, { done: true });
    expect(response.body).toEqual({ reminder });
  });

  it("deletes a reminder", async () => {
    // Arrange
    deleteReminder.mockResolvedValue(true);

    // Act
    const response = await request(app).delete("/api/reminders/1");

    // Assert
    expect(response.status).toBe(204);
    expect(deleteReminder).toHaveBeenCalledWith(1);
  });
});
