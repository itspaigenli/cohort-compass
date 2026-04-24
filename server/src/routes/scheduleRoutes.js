import express from "express";
import { listSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", listSchedule);

export default router;
