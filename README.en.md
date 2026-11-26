<!-- Language switcher -->
<p align="center"><a href="README.md">简体中文</a> · <strong>English</strong></p>

<h1 align="center">🦖 Interactive Math Explainer</h1>
<p align="center"><code>dino-math-explainer</code> · v1.0.0</p>
<p align="center">Turn a math problem or concept into an interactive HTML lesson you can present step by step.</p>

## Quick install

Send this GitHub repository link to Codex, Claude, or another product that supports Agent Skills, along with this prompt. [Agent Skills specification](https://agentskills.io/specification)

> Read this repository's README and follow the installation steps below to install `dino-math-explainer` in your current environment. Install it in the current project by default. If the product requires an upload, prepare the bundle in its required format and import it if you have permission. Tell me the install scope, version, how to invoke the skill, and whether the product recognizes it.

### Installation steps

1. **Get the complete skill.** The repository root is the skill directory. Use the requested Git tag or commit if the user specified one. Otherwise, use the version the link points to. Clone the repository or download the source ZIP. If the environment cannot reach GitHub, ask the user to upload the source ZIP.
2. **Install for the product and scope.** Name the directory `dino-math-explainer` and preserve all relative paths, including `SKILL.md`, the READMEs, scripts, references, and bundled audio. Exclude `.git/` when copying or packaging. If a skill with the same name exists, check its version and source, then confirm how to handle any local changes.
3. **Verify that the skill loads.** Check `name` and `metadata.version` in `SKILL.md` and confirm the supporting files are present. If the skill is missing from the product's skill list or invocation menu, reopen the target session and check again. Report the version, install location or account scope, and whether the product recognizes the skill. If permissions block an action, say which step the user needs to complete. Products with read-only file access can use the complete bundle in the current session by following `SKILL.md`.

| Product | Project / workspace | User install or import |
| --- | --- | --- |
| [Codex](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/dino-math-explainer/` | `~/.agents/skills/dino-math-explainer/` |
| [Claude Code](https://code.claude.com/docs/en/skills) | `.claude/skills/dino-math-explainer/` | `~/.claude/skills/dino-math-explainer/` |
| [Claude on the web / Cowork](https://support.claude.com/en/articles/12512180-use-skills-in-claude) | — | Add a custom skill under `Plugins` or `Customize` and upload the ZIP. |
| [ChatGPT (eligible workspaces)](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) | — | `Plugins → Skills → Create → Upload from your computer` |
| [Tencent WorkBuddy](https://www.codebuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market) | — | Go to `Skills → Add Skill → Upload Skill` and select the complete local skill package. |
| [Doubao Work (desktop)](https://www.feishu.cn/content/article/7677519271848610746) | — | Open `技能・连接器・伙伴` (Skills, Connectors, Partners) in the sidebar and import the local bundle from the Skills page. |
| [TraeWork (legacy)](https://docs.trae.cn/work_skills) | `.trae/skills/dino-math-explainer/` | Go to `Plugin Marketplace → Skills → Upload Skill`. Put `SKILL.md` and supporting files at the ZIP root. |
| [TRAE IDE (China edition)](https://docs.trae.cn/ide_skills) | `.trae/skills/dino-math-explainer/` | `~/.trae-cn/skills/dino-math-explainer/` |
| [Cursor (local)](https://cursor.com/docs/skills) | `.cursor/skills/dino-math-explainer/` | `~/.cursor/skills/dino-math-explainer/` |
| [GitHub Copilot (VS Code)](https://code.visualstudio.com/docs/agent-customization/agent-skills) | `.github/skills/dino-math-explainer/` | `~/.copilot/skills/dino-math-explainer/` |
| [Gemini CLI](https://geminicli.com/docs/cli/skills/) | `.gemini/skills/dino-math-explainer/` | `~/.gemini/skills/dino-math-explainer/` |
| [OpenClaw](https://docs.openclaw.ai/skills) | `skills/dino-math-explainer/` | `~/.openclaw/skills/dino-math-explainer/` |
| [OpenCode](https://opencode.ai/docs/skills/) | `.opencode/skills/dino-math-explainer/` | `~/.config/opencode/skills/dino-math-explainer/` |
| [CodeBuddy Code](https://www.codebuddy.ai/docs/cli/skills) | `.codebuddy/skills/dino-math-explainer/` | `~/.codebuddy/skills/dino-math-explainer/` |
| [Qoder CLI](https://docs.qoder.com/cli/Skills) | `.qoder/skills/dino-math-explainer/` | `~/.qoder/skills/dino-math-explainer/` |
| [Kiro (IDE / CLI)](https://kiro.dev/docs/cli/skills/) | `.kiro/skills/dino-math-explainer/` | `~/.kiro/skills/dino-math-explainer/` |
| [Devin Local](https://docs.devin.ai/desktop/devin-local/customizations) | `.devin/skills/dino-math-explainer/` | `~/.config/devin/skills/dino-math-explainer/` |
| Other Agent Skills products | Use the project path in the product docs | Use the product’s local install or import option |

Project paths are relative to **the target project or agent workspace**. If the product asks you to upload a package, use its file picker and keep all supporting files with `SKILL.md`. If the agent cannot access the upload screen, it should provide the prepared package and tell the user where to upload it.

<details>
<summary><strong>ZIP layout for Claude and TraeWork</strong></summary>

- **For Claude,** zip the `dino-math-explainer/` folder so `dino-math-explainer/SKILL.md` appears inside the ZIP. If you downloaded a GitHub source ZIP, unpack it and remove the branch or tag suffix from the folder name before repacking. [ZIP packaging guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) · [Plugins menu rollout](https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)
- **For TraeWork,** zip the contents of that folder so `SKILL.md` is at the ZIP root. [TraeWork skill upload guide](https://docs.trae.cn/work_skills)

</details>
