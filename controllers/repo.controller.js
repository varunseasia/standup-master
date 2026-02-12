import { getRepoCommits } from "../services/githubService.js";

export async function getRepoStatus(req, res, next) {
  try {
    const { owner, repo } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({
        message: "owner and repo are required",
      });
    }

    const commits = await getRepoCommits(owner, repo);

    // group by author //
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
  } catch (error) {
    next(error);
  }
}
