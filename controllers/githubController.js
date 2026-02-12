import { getUserOrgs, getUserRepos } from "../services/githubService.js";

export async function getOrgs(req, res, next) {
  const orgs = req.query;
  res.json({ orgs });
}

export async function getRepos(req, res, next) {
  const { user } = req.query;

  const repos = await getUserRepos(user);

  res.json({ repos });
}
