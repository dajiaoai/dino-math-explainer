# 几何演示：algeo-sdk

## 适用场景与调用方式

用于几何主图、精确构造、函数图像和参数探索。固定主图也用原生对象构造，在同一画板内通过 [Reveal](algeo-presentation.md) 分步绘制、高亮和揭示标注。页面由 agent 自主设计，几何能力统一通过 `algeo-sdk` 接入。

## 生成与交付流程

1. **生成和调试。** 在创作环境创建编辑实例，通过 `editor.repl(command)` 构造几何、核对数学关系并修正错误。用编辑画板检查效果，也可将阶段快照加载到演示实例检查布局和 Reveal。
2. **导出定稿。** 确认构造和演示效果后，将拖拽点、滑块和视角调整到课堂起始状态，再调用 `editor.document.getContent()`，取得完整的 `FileContentLatest` 工程快照。每次修改几何工程后重新导出。
3. **发布与启动。** 将完整快照内嵌到交付 HTML。每次打开课件，只创建演示实例并调用 `presentation.loadFile(snapshot)`。把编辑实例、REPL 命令、`loadSource()` 和创作辅助代码留在生成环境。需要继续编辑时，在创作环境用 `editor.document.loadContent(snapshot)` 恢复工程。见[课件启动与快照内嵌](algeo-sdk-integration.md#课件启动与快照内嵌)。

**本地 HTML 必须通过 `file://` 直接打开。此场景创建编辑和演示实例都无需传入鉴权参数，不传 `auth` 或 appId，也不要求启动本地 HTTP 服务。** 远程 SDK 资源仍需联网。

## 在创作环境调试画板

```html
<script src="https://cdn.jsdelivr.net/npm/@dajiaoai/algeo-sdk@latest/dist/algeo-sdk.umd.js"></script>

<!-- 保持非零尺寸，移到屏外；隐藏节点不接收指针或键盘焦点。 -->
<div id="geometry-editor" inert aria-hidden="true"
     style="position:fixed;left:-20000px;top:0;width:800px;height:600px;visibility:hidden;pointer-events:none"></div>
```

不要用 `display:none` 或零尺寸容器初始化编辑实例，以免内嵌画板无法正确测量。挂载尺寸和演示区域布局由 agent 按页面需要调整。

下面代码在 SDK 脚本和容器就绪后执行。`authOptions` 由页面按入口设置。在线使用部署配置中的 `{ auth: { appId } }`，本地使用 `{}` 检查免鉴权兼容性。

```js
const editor = await AlgeoSdk.createEditor(
  document.getElementById('geometry-editor'),
  { ...authOptions, ui: { navbar: false, slidePanel: false, toolboxPanel: false,
          algebraPanel: false, docPanel: false } }
);

async function runRepl(command) {
  try {
    const result = await editor.repl(command);
    return { command, success: true, output: result.output };
  } catch (error) {
    return {
      command, success: false,
      code: error.code ?? null,
      message: String(error.message ?? error)
    };
  }
}

// 供 agent 在创作环境逐条调试，并在定稿后显式读取快照。
window.geometry = {
  repl: runRepl,
  exportSnapshot: async () => editor.document.getContent()
};
```

## 逐条定义、回读并导出

```js
for (const command of [
  'def A := Point(0, 0)',
  'def B := Point(4, 0)',
  'def edge := Segment(A, B)',
  'label A := "A"',
  'style #edge { color: #2563EB; lineWidth: 3; }',
  'list',
  'eval B.x - A.x'
]) {
  const result = await window.geometry.repl(command);
  console.log(result); // agent 必须读取 output 或 code/message
  if (!result.success) {
    throw new Error(`REPL 失败：${result.command}\n${result.message}`);
  }
}
```

每次调用只传一条命令，顺序 await。成功输出的具体文本由 SDK 决定，不要假设定义命令一定返回特定格式；语法不确定时，观察语法错误返回，不确定可执行 `help syntax`。

REPL 失败可能留下部分修改；命令执行成功也不代表类型或数学关系正确。比如需要线段时，应核对定义使用的是 `Segment` 而非 `Line`。

完成回读和画面验证后，执行 `await window.geometry.exportSnapshot()`。显式读取编辑器的最新工程，REPL 修改不会触发宿主的 `contentChange` 事件。工程内含对象定义、变量值、样式等，应保留 SDK 导出的完整对象。

## 基本语法

```text
-- 定义点、线段、三角形
 def A := Point(0, 0)
 def B := Point(4, 0)
 def C := Point(1, 3)
 def edge := Segment(A, B)
 def tri := Polygon(A, B, C)

-- 标签与样式
 label A := "A"
 style #tri { color: #2563EB; lineWidth: 2; }

-- 函数与滑块
 def f := Curve(sin(x), -2π, 2π)
 def t := Slider(?:=0).withMin(0).withMax(1).withStep(0.01)

-- 回读与帮助
 list
 eval A.x
 help Segment
```

`--` 是注释，`#ID` 用于样式选择。`show`、`hide`、`set`、`play`、`stop` 是动作块中的动作，不是独立 REPL 命令；画板内显示、绘制和高亮可使用原生 [Reveal](algeo-presentation.md)。

## 完整语法与高阶用法

- [官方完整 REPL 语法文档](https://open.dajiaoai.com/sdk/repl)：查询画板管理、定义、样式、几何构造、动画与交互、输出格式及错误行为。本文只保留基本用法，制作时按需查阅完整文档，并用 `help <Topic>` 核对具体语法。
- [presentation：JSX 与 Reveal 补充用法](algeo-presentation.md)：画板内文字与公式、初始隐藏、分步绘制与高亮、同一步动作组合，以及空白点击推进控制。涉及演示编排时读取，作为官方 REPL 文档之外的专项参考。
