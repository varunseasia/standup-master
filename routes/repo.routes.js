import express from "express";
import { getRepoStatus } from "../controllers/repo.controller.js";

const router = express.Router();
router.get("/repo-status", getRepoStatus);

export default router;