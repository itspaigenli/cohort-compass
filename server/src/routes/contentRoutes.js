import express from "express";
import { getContent, listContent } from "../controllers/contentController.js";

const router = express.Router();

router.get("/", listContent);
router.get("/doc", getContent);

export default router;
