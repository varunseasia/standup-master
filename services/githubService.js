import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is missing in environment variables");
}

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
  timeout: 15_000,
});

export async function getUserOrgs() {
  {
    const res = await github.get(`/user/orgs`);
    return res.data;
  }
}

export async function getUserRepos(userName) {
  const res = await github.get(`/users/${userName}/repos`);
  return res.data;
}

export async function getRepoCommits(owner, repo) {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  const res = await github.get(`/repos/${owner}/${repo}/commits`, {
    params: {
      since: since.toISOString(),
      per_page: 100,
    },
  });
  return res.data;
}

export async function getTodayCommits(owner, repo) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const res = await github.get(`/repos/${owner}/${repo}/commits`, {
      params: {
        since: since.toISOString(),
        per_page: 100,
      },
    });

    return res.data.map((c) => ({
      message: c.commit.message.split("\n")[0], // first line only
      author: c.commit.author?.name || "Unknown",
    }));
  } catch (err) {
    // Handle common GitHub failures gracefully
    if (err.response?.status === 404) {
      console.warn(`Repo not found: ${owner}/${repo}`);
      return [];
    }

    if (err.response?.status === 403) {
      // console.warn("GitHub API rate limit exceeded");
      return [];
    }

    console.error("GitHub fetch failed:", err.message);
    return [];
  }
}
