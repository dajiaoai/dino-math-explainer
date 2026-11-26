<!-- Language switcher -->
<p align="center"><strong>简体中文</strong> · <a href="README.en.md">English</a></p>

<h1 align="center">🦖 数学动态讲解</h1>
<p align="center"><code>dino-math-explainer</code> · v1.0.1</p>
<p align="center"><strong>给一道题，就能开始备一堂动态数学课。</strong></p>

## 为什么使用这个 Skill

把题目或知识点交给 Skill，它会拟好讲解方案、制作课件并走查成品。你确认怎么讲、预览整套课件，上课时按学生的反应决定何时推进。

- **备课有一套可以直接审阅的方案。** 从教学目标出发，排好先看什么、何时提问、哪里停顿、哪一步揭晓答案，再为每一步选好用图、用公式还是让学生动手。
- **拿到的课件可以直接投影讲。** 动画演示图形的变化，短音效提示关键一步，拖拽和滑块让学生亲手验证猜想。你可以点一下讲一步，也可以回到前一步。交付为交互 HTML，联网即可用浏览器打开，投影时题干、公式、图形和标注一起等比缩放。
- **每一步推理都准确。** 逐项核对题设、几何构造、代数变形和结论，让辅助线、标注和公式在对应的推理步骤出现。交付前还会在浏览器里实测前进、回退和缩放。


[![数学动态讲解 Skill，属于大角几何旗下。微信扫码加入开发者交流群。](assets/developer-community.png)](assets/developer-community.png)

点击卡片可查看原尺寸二维码。

## 快速安装

把本仓库的 GitHub 链接和下面这段话一起发给 Codex、Claude 或其他支持 Agent Skills 的产品。 [Agent Skills 规范](https://agentskills.io/specification)

> 请读取这个仓库的 README，按下方「安装步骤」把 `dino-math-explainer` 安装到你当前的运行环境。默认装到当前项目。若产品需要上传，请按它要求的格式准备技能包，并在权限允许时导入。完成后请告诉我安装范围、版本、调用方式，以及产品是否已识别该技能。

### 安装步骤

1. **获取完整技能包。** 仓库根目录就是技能目录。用户指定 Git 标签或提交时使用该版本，否则使用链接指向的版本。克隆仓库或下载源码 ZIP。若环境无法访问 GitHub，请用户上传源码 ZIP。
2. **按产品和范围安装。** 将整个技能目录命名为 `dino-math-explainer`，保留所有文件的相对位置，包括 `SKILL.md`、README、脚本、参考资料和内置音频。复制或打包时排除 `.git/`。已有同名技能时，先核对版本和来源，再确认如何处理本地修改。
3. **确认技能已加载。** 检查 `SKILL.md` 中的 `name`、`metadata.version` 及随附资源。若技能未出现在技能列表或调用菜单，重开目标会话再检查。回报版本、安装位置或账号范围，以及产品是否已识别技能。权限受限时，说明还需要哪项用户操作。仅能读取文件的产品可在当前会话使用完整技能包并遵循 `SKILL.md`。

| 产品 | 项目或工作区 | 用户安装或导入 |
| --- | --- | --- |
| [Codex](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/dino-math-explainer/` | `~/.agents/skills/dino-math-explainer/` |
| [Claude Code](https://code.claude.com/docs/en/skills) | `.claude/skills/dino-math-explainer/` | `~/.claude/skills/dino-math-explainer/` |
| [Claude 网页版 / Cowork](https://support.claude.com/en/articles/12512180-use-skills-in-claude) | — | 在 `Plugins` 或 `Customize` 中添加自定义技能，上传 ZIP。 |
| [ChatGPT（支持技能的工作区）](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) | — | `Plugins → Skills → Create → Upload from your computer` |
| [腾讯 WorkBuddy](https://www.codebuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market) | — | `技能 → 添加技能 → 上传技能`，选择完整的本地技能包。 |
| [豆包工作（电脑端）](https://www.feishu.cn/content/article/7677519271848610746) | — | 打开侧栏「技能・连接器・伙伴」，在技能页使用本地导入。 |
| [TraeWork（旧版）](https://docs.trae.cn/work_skills) | `.trae/skills/dino-math-explainer/` | `插件市场 → 技能 → 上传技能`，ZIP 根目录直接放 `SKILL.md` 和资源。 |
| [TRAE IDE（中国版）](https://docs.trae.cn/ide_skills) | `.trae/skills/dino-math-explainer/` | `~/.trae-cn/skills/dino-math-explainer/` |
| [Cursor（本地）](https://cursor.com/docs/skills) | `.cursor/skills/dino-math-explainer/` | `~/.cursor/skills/dino-math-explainer/` |
| [GitHub Copilot（VS Code）](https://code.visualstudio.com/docs/agent-customization/agent-skills) | `.github/skills/dino-math-explainer/` | `~/.copilot/skills/dino-math-explainer/` |
| [Gemini CLI](https://geminicli.com/docs/cli/skills/) | `.gemini/skills/dino-math-explainer/` | `~/.gemini/skills/dino-math-explainer/` |
| [OpenClaw](https://docs.openclaw.ai/skills) | `skills/dino-math-explainer/` | `~/.openclaw/skills/dino-math-explainer/` |
| [OpenCode](https://opencode.ai/docs/skills/) | `.opencode/skills/dino-math-explainer/` | `~/.config/opencode/skills/dino-math-explainer/` |
| [CodeBuddy Code](https://www.codebuddy.ai/docs/cli/skills) | `.codebuddy/skills/dino-math-explainer/` | `~/.codebuddy/skills/dino-math-explainer/` |
| [Qoder CLI](https://docs.qoder.com/cli/Skills) | `.qoder/skills/dino-math-explainer/` | `~/.qoder/skills/dino-math-explainer/` |
| [Kiro（IDE / CLI）](https://kiro.dev/docs/cli/skills/) | `.kiro/skills/dino-math-explainer/` | `~/.kiro/skills/dino-math-explainer/` |
| [Devin Local](https://docs.devin.ai/desktop/devin-local/customizations) | `.devin/skills/dino-math-explainer/` | `~/.config/devin/skills/dino-math-explainer/` |
| 其他 Agent Skills 产品 | 使用该产品文档指定的项目路径 | 使用该产品提供的安装或导入入口 |

项目路径从**目标项目或 Agent 工作区的根目录**算起。需要上传时，按产品的文件选择器准备完整技能包，保留 `SKILL.md` 和随附资源。若 Agent 无法操作上传界面，应提供准备好的技能包，并告知用户上传入口。

<details>
<summary><strong>Claude 和 TraeWork 的 ZIP 结构</strong></summary>

- **Claude** 将整个 `dino-math-explainer/` 目录压缩，ZIP 内的路径应为 `dino-math-explainer/SKILL.md`。如果下载的是 GitHub 源码 ZIP，先解压并去掉目录名末尾的分支或标签后缀，再重新打包。 [ZIP 打包说明](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) · [Plugins 界面更新说明](https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)
- **TraeWork** 压缩目录内的文件和子目录，让 `SKILL.md` 直接位于 ZIP 根目录。 [TraeWork 技能上传说明](https://docs.trae.cn/work_skills)

</details>
