import axios from "axios";

export async function generateStandup(repoData) {
  if (!repoData || repoData.length === 0) {
    return "Overall Summary:\n- No commits across repositories in the last 24 hours.\n\nRepo Breakdown:\n- N/A\n\nRisks:\n- None";
  }

  const formattedCommits = repoData
    .map((repo) => {
      if (!repo.commits?.length) {
        return `Repository: ${repo.repo}\n- No commits in last 24 hours`;
      }

      const commitList = repo.commits.map((c) => `- ${c.message}`).join("\n");

      return `Repository: ${repo.repo}\n${commitList}`;
    })
    .join("\n\n") // 🔥 THIS WAS MISSING
    .trim();

  const prompt = `
 You are a senior engineering manager.

 Based on the following multi-repository commits, generate a concise, professional team standup update.

Guidelines:
- Be outcome-focused
- Do not repeat commit messages verbatim
- Group related work
- Highlight progress, impact, and concerns
- Use bullet points

Commits:
${formattedCommits}

Return strictly in the following format:

Overall Summary:
- ...

Repo Breakdown:
- Repo Name:
  - ...

Risks:
- ...
`;

  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          num_predict: 200, // ↓ reduced
        },
      },
      {
        timeout: 120_000, // ↑ increased
      },
    );

    return response.data.response?.trim();
  } catch (err) {
    console.error("❌ Standup API error:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}
// 🟢 2. Developer Specific Summary
export async function generateDeveloperSummary(repoData, query) {
  const { commitsByAuthor } = repoData;

  const formattedCommits = Object.entries(commitsByAuthor)
    .map(([author, commits]) => {
      const commitText = commits.map((msg) => `- ${msg}`).join("\n");
      return `Developer: ${author}\n${commitText}`;
    })
    .join("\n\n");

  const prompt = `
You are a senior engineering manager.
 
Here are the recent commits grouped by developer:
 
${formattedCommits}
 
User Question:
"${query}"
 
Instructions:
- Identify which developer the user is referring to (even if nickname or partial name is used)
- Explain clearly what work that developer did
- Keep answer concise and professional
`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false,
  });

  return response.data.response;
}
