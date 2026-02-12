import { getRepoCommits } from "../services/githubService.js";
import { generateDeveloperSummary } from "../services/llmService.js";
 
// 1️⃣ Basic repo status (no LLM)
export async function getRepoStatus(req, res, next) {
  try {
    const { owner, repo } = req.query;
 
    if (!owner || !repo) {
      return res.status(400).json({
        message: "owner and repo are required",
      });
    }
 
    const commits = await getRepoCommits(owner, repo);
 
    const grouped = {};
 
    commits.forEach((commit) => {
      const author = commit.author?.login || "unknown";
 
      if (!grouped[author]) {
        grouped[author] = [];
      }
 
      grouped[author].push(commit.commit.message);
    });
 
    res.json({
      totalCommits: commits.length,
      contributors: Object.keys(grouped).length,
      commitsByAuthor: grouped,
    });
  } catch (err) {
    next(err);
  }
}
 
 
// 2️⃣ Ask repo query (LLM integrated)
export async function askRepoQuery(req, res, next) {
  try {
    const { owner, repo, query } = req.body;
 
    if (!owner || !repo || !query) {
      return res.status(400).json({
        message: "owner, repo and query are required",
      });
    }
 
    const commits = await getRepoCommits(owner, repo);
 
    const grouped = {};
 
    commits.forEach((commit) => {
      const author = commit.author?.login || "unknown";
 
      if (!grouped[author]) {
        grouped[author] = [];
      }
 
      grouped[author].push(commit.commit.message);
    });
 
    const repoData = {
      owner,
      repo,
      commitsByAuthor: grouped,
    };
 
    const answer = await generateDeveloperSummary(repoData, query);
 
    res.json({ answer });
  } catch (err) {
    next(err);
  }
}