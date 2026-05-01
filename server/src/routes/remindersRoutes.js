import express from "express";
import {
  deleteReminderById,
  getReminders,
  patchReminder,
  postReminder,
} from "../controllers/remindersController.js";

const router = express.Router();

router.get("/", getReminders);
router.post("/", postReminder);
router.patch("/:id", patchReminder);
router.delete("/:id", deleteReminderById);

export default router;
