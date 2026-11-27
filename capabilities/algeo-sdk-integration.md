# algeo-sdk 接入参考

本说明只描述几何能力的接入，不规定讲解页面结构、slide 格式或播放器。agent 根据任务安排挂载容器、实例数量、布局、状态和演示顺序。

## 入口与本地运行

浏览器可通过 UMD 脚本接入，入口为 `window.AlgeoSdk`：

```html
<script src="https://cdn.jsdelivr.net/npm/@dajiaoai/algeo-sdk@latest/dist/algeo-sdk.umd.js"></script>
```

本地 HTML 使用 `file://` 直接打开，此场景不传入鉴权参数，不需要本地 HTTP 服务。远程 SDK 资源需要联网；使用的版本与实际加载结果应在验证时记录。

## 课件启动与快照内嵌

将创作环境用 `editor.document.getContent()` 导出的完整工程对象序列化为 JSON，写入 HTML 中的 `application/json` 数据块。序列化时用 `JSON.stringify(snapshot).replace(/</g, '\\u003c')` 转义 `<`，让标签或富文本中的 `</script>` 也能原样保存。快照随 HTML 一起交付，双击打开时可直接从 DOM 读取。

以下是 `file://` 入口的启动片段。生成 HTML 时，把 `__ALGEO_SNAPSHOT__` 替换为完整的转义后 JSON。在线入口的 `createPresentation` 选项使用部署配置中的 `auth: { appId }`。

```html
<div id="geometry-presentation" style="width:100%;height:100%"></div>
<script id="geometry-snapshot" type="application/json">__ALGEO_SNAPSHOT__</script>
<script type="module">
  const snapshot = JSON.parse(document.getElementById('geometry-snapshot').textContent);
  const presentation = await AlgeoSdk.createPresentation(
    document.getElementById('geometry-presentation'),
    { ui: { slidePanel: false, pencilToolbar: false, logo: false, zoomControl: false } }
  );
  await presentation.loadFile(snapshot);
</script>
```

先加载上文的 SDK 脚本，再执行启动代码。成品每次打开只用工程快照初始化演示实例。编辑端的恢复和 REPL 调试见[几何演示生成流程](algeo-sdk.md#生成与交付流程)。

项目含多个画板时，在 `loadFile()` 完成后用 `presentation.switchSlide(index)` 定位画板，索引从 0 开始。外层课件可按教学需要安排画板与讲解步骤的关系。

## 课件画布缩放

将可见的 SDK 挂载节点放在演示画布内。可让整个 SDK 渲染区域（含 iframe）和外层 HTML 讲解共享画布的缩放父层，使画板中以像素设置的字号、线宽、点尺寸和标签偏移也随整页缩放。仅改变挂载节点宽高或几何视野时，须实测这些样式尺寸是否也随画布倍率变化。采用整体缩放时，保持挂载节点的设计尺寸，避免叠加一次视野缩放。


## 嵌入异常与验证

- 保持演示容器和 SDK iframe 可见，让 SDK 自己展示错误原因、解决步骤和操作入口。外层 HTML 的 `catch`、`onerror` 或超时处理可记录诊断。保留原生提示的显示区域与交互，避免用遮罩、通用报错、备用画布或清空 iframe 覆盖它。
- 关闭创作页后，通过 `file://` 重新打开最终 HTML。确认演示端仅从内嵌快照启动，并走查初始画面、对象关系、标注、拖拽或滑块联动、Reveal 前进和回退。若同时交付在线版，也走查在线入口。

## 演示编排

画板内分步显示、绘制和高亮可参考 [Reveal](algeo-presentation.md)。外层文字、公式和其他学生所见的素材由 agent 自主编排，并明确一次输入推进什么，避免同时推进两层演示。只有需要重置时才重载工程；仅揭示屏幕文字或调整布局时应保留当前交互状态。

官方文档按需查看：[编辑模式](https://open.dajiaoai.com/sdk/2/editor)、[演示模式](https://open.dajiaoai.com/sdk/2/presentation)、[REPL](https://open.dajiaoai.com/sdk/repl)。`file://` 免鉴权以本项目的本地使用要求为准。
