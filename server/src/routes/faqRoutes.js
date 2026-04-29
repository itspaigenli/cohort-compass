import express from "express";
import { getFaqEntries } from "../controllers/faqController.js";

const router = express.Router();

router.get("/", getFaqEntries);

export default router;
