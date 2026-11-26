# algeo-sdk 接入参考

本说明只描述几何能力的接入，不规定讲解页面结构、slide 格式或播放器。agent 根据任务安排挂载容器、实例数量、布局、状态和演示顺序。

## 入口与本地运行

浏览器可通过 UMD 脚本接入，入口为 `window.AlgeoSdk`：

```html
<script src="https://cdn.jsdelivr.net/npm/@dajiaoai/algeo-sdk@latest/dist/algeo-sdk.umd.js"></script>
```

本地 HTML 使用 `file://` 直接打开，此场景不传入鉴权参数，不需要本地 HTTP 服务。远程 SDK 资源需要联网；使用的版本与实际加载结果应在验证时记录。

## 创作与演示

使用隐藏编辑实例构造、回读与导出，使用可见演示实例展示；完整初始化和错误处理示例以[能力入口 README](README.md)为准。两者不要求对应到固定的外层 slide 数据模型。

```js
const editor = await AlgeoSdk.createEditor(editorContainer, {});
await editor.repl('def A := Point(0, 0)');
await editor.repl('def B := Point(4, 0)');
await editor.repl('def edge := Segment(A, B)');
await editor.repl('list');
const snapshot = await editor.document.getContent();

const presentation = await AlgeoSdk.createPresentation(presentationContainer, {});
await presentation.loadFile(snapshot);
```

变量中的容器由 agent 在页面中创建。以上是能力调用片段，不是必须复用的页面模板。

- 编辑端通过 `document.getContent()` 导出原生工程，通过 `document.loadContent(snapshot)` 恢复；演示端通过 `loadFile(snapshot)` 加载。
- `repl(command)` 单次执行一条命令。关键构造后回读类型、值和依赖，避免语法合法但几何对象错误。
- 需要选择工具工程中的画板时使用 `switchSlide(index)`，序号从 0 开始；画板与外层教学步骤的关系由 agent 决定。
- 原生工程快照属于 SDK 的存储协议，不是本 skill 的统一课件格式。由 SDK 导出，避免凭空拼造协议字段。

## 课件画布缩放

将可见的 SDK 挂载节点放在演示画布内。可让整个 SDK 渲染区域（含 iframe）和外层 HTML 讲解共享画布的缩放父层，使画板中以像素设置的字号、线宽、点尺寸和标签偏移也随整页缩放。仅改变挂载节点宽高或几何视野时，须实测这些样式尺寸是否也随画布倍率变化。采用整体缩放时，保持挂载节点的设计尺寸，避免叠加一次视野缩放。


## 嵌入异常与验证

- 保持演示容器和 SDK iframe 可见，让 SDK 自己展示错误原因、解决步骤和操作入口。外层 HTML 的 `catch`、`onerror` 或超时处理可记录诊断。保留原生提示的显示区域与交互，避免用遮罩、通用报错、备用画布或清空 iframe 覆盖它。

## 演示编排

画板内分步显示、绘制和高亮可参考 [Reveal](presentation.md)。外层文字、公式和其他学生所见的素材由 agent 自主编排，并明确一次输入推进什么，避免同时推进两层演示。只有需要重置时才重载工程；仅揭示屏幕文字或调整布局时应保留当前交互状态。

官方文档按需查看：[编辑模式](https://open.dajiaoai.com/sdk/2/editor)、[演示模式](https://open.dajiaoai.com/sdk/2/presentation)、[REPL](https://open.dajiaoai.com/sdk/repl)。`file://` 免鉴权以本项目的本地使用要求为准。
