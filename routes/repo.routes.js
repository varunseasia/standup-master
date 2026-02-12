import express from "express";
import { getRepoStatus, askRepoQuery } from "../controllers/repo.controller.js";
 
const router = express.Router();
 
router.get("/repo-status", getRepoStatus);
router.post("/ask", askRepoQuery);
 
export default router;