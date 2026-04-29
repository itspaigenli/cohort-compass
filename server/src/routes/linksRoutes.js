import express from "express";
import { getLinks } from "../controllers/linksController.js";

const router = express.Router();

router.get("/", getLinks);

export default router;
