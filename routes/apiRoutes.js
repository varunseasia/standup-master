import express from "express";
import { getOrgs ,getRepos} from "../controllers/githubController.js";
import {generateStandupReport} from "../controllers/standupController.js";
const router = express.Router();

router.get("/repos", getRepos);
router.get("/orgs", getOrgs);
router.get("/standup", generateStandupReport);

export default router;
