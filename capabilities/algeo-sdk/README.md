# 几何演示：algeo-sdk

## 适用场景与调用方式

用于几何主图、精确构造、函数图像和参数探索。固定主图也用原生对象构造，在同一画板内通过 [Reveal](presentation.md) 分步绘制、高亮和揭示标注。页面由 agent 自主设计，几何能力统一通过 `algeo-sdk` 接入。

使用一对实例完成创作和展示：

- **编辑实例**隐藏在界面之外，agent 调用其 `repl(command)` 定义对象、回读结果和处理报错。
- **演示实例**显示在讲解界面，供用户观察、拖动和操作。
- 一组构造完成并回读确认后，调用编辑实例的 `document.getContent()`，将完整快照加载到演示实例。不要靠在两个实例分别执行命令维持一致。

**本地 HTML 必须通过 `file://` 直接打开。此场景创建编辑和演示实例都无需传入鉴权参数，不传 `auth` 或 appId，也不要求启动本地 HTTP 服务。** 远程 SDK 资源仍需联网。

演示端保留大角 SDK 原生错误提示和解决引导。下文 `runRepl` 的 `catch` 只用于创作端回读命令错误。演示端按[嵌入异常与验证](sdk-integration.md#嵌入异常与验证)处理。

## 基本接入：隐藏编辑端，可见演示端

```html
<script src="https://cdn.jsdelivr.net/npm/@dajiaoai/algeo-sdk@latest/dist/algeo-sdk.umd.js"></script>

<!-- 保持非零尺寸，移到屏外；隐藏节点不接收指针或键盘焦点。 -->
<div id="geometry-editor" inert aria-hidden="true"
     style="position:fixed;left:-20000px;top:0;width:800px;height:600px;visibility:hidden;pointer-events:none"></div>
<!-- 此节点放在课件画布内，由画布版式分配设计宽高。 -->
<div id="geometry-presentation" style="width:100%;height:100%"></div>
```

不要用 `display:none` 或零尺寸容器初始化编辑实例，以免内嵌画板无法正确测量。挂载尺寸和演示区域布局由 agent 按页面需要调整。

下面代码在 SDK 脚本和容器就绪后执行。`authOptions` 由页面按入口设置。在线使用部署配置中的 `{ auth: { appId } }`，本地使用 `{}` 检查免鉴权兼容性。

```js
const editor = await AlgeoSdk.createEditor(
  document.getElementById('geometry-editor'),
  { ...authOptions, ui: { navbar: false, slidePanel: false, toolboxPanel: false,
          algebraPanel: false, docPanel: false } }
);
const presentation = await AlgeoSdk.createPresentation(
  document.getElementById('geometry-presentation'),
  { ...authOptions, ui: { slidePanel: false, pencilToolbar: false, logo:false, zoomControl:false } }
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

async function syncPresentation() {
  const snapshot = await editor.document.getContent();
  await presentation.loadFile(snapshot);
  return snapshot;
}

// agent 可通过当前页面的执行环境逐次调用，并读取结构化返回值。
window.geometry = { repl: runRepl, sync: syncPresentation };
```

**同步接口名称：**这里“把内容同步到演示模式”的原生方法是 `presentation.loadFile(snapshot)`，不是 `presentation.loadContent()`。`document.loadContent(snapshot)` 用于恢复编辑实例。依据当前[编辑 API](https://open.dajiaoai.com/sdk/2/editor)与[演示 API](https://open.dajiaoai.com/sdk/2/presentation)，同步链路为：

```text
隐藏编辑实例 editor.repl(command)
  → 获取成功输出或错误
  → 回读核对构造
  → editor.document.getContent()
  → 可见演示实例 presentation.loadFile(snapshot)
```

## 逐条定义、回读并同步

```js
for (const command of [
  'def A := Point(0, 0)',
  'def B := Point(4, 0)',
  'def edge := Segment(A, B)',
  'label A := "A"',
  'style #edge { color: #2563EB; lineWidth: 3; }'
]) {
  const result = await geometry.repl(command);
  console.log(result); // agent 必须读取 output 或 code/message
  if (!result.success) {
    throw new Error(`REPL 失败：${result.command}\n${result.message}`);
  }
}
```

每次调用只传一条命令，顺序 await。成功输出的具体文本由 SDK 决定，不要假设定义命令一定返回特定格式；语法不确定时，观察语法错误返回，不确定可执行 `help syntax`。

REPL 失败可能留下部分修改；命令执行成功也不代表类型或数学关系正确。比如需要线段时，应核对定义使用的是 `Segment` 而非 `Line`。

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

`--` 是注释，`#ID` 用于样式选择。`show`、`hide`、`set`、`play`、`stop` 是动作块中的动作，不是独立 REPL 命令；画板内显示、绘制和高亮可使用原生 [Reveal](presentation.md)。

## 完整语法与高阶用法

- [官方完整 REPL 语法文档](https://open.dajiaoai.com/sdk/repl)：查询画板管理、定义、样式、几何构造、动画与交互、输出格式及错误行为。本文只保留基本用法，制作时按需查阅完整文档，并用 `help <Topic>` 核对具体语法。
- [presentation：JSX 与 Reveal 补充用法](presentation.md)：画板内文字与公式、初始隐藏、分步绘制与高亮、同一步动作组合，以及空白点击推进控制。涉及演示编排时读取，作为官方 REPL 文档之外的专项参考。
