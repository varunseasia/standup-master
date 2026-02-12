import {
  getTodayCommits,
} from "../services/githubService.js";

import { generateStandup } from "../services/llmService.js";

 

export const generateStandupReport = async (req, res, next) => {
  try {
    const { owner, repo } = req.query;
    if (!owner || !repo)
      return res.status(400).json({ error: "Owner and repo required" });

    const repoList = repo.split(",").map((r) => r.trim());

    const repoData = [];

    for (const r of repoList) {
      const commits = await getTodayCommits(owner, r);
      repoData.push({ repo: r, commits });
    }

    const summary = await generateStandup(repoData);

    res.json({ owner, repos: repoList, summary });
  } catch (err) {
    next(err);
  }
};
