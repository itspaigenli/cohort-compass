import express from "express";
import { getCurriculumReferences } from "../controllers/curriculumController.js";

const router = express.Router();

router.get("/", getCurriculumReferences);

export default router;
