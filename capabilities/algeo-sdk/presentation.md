# JSX 与 Reveal 快速参考

## 点击空白处翻页

`blank_click_next_slide on` 开启文件级选项：演示时点击空白处先播放 reveal，当前画板的步骤完成后再次点击切换到下一画板。`blank_click_next_slide off` 关闭翻页，只播放 reveal；这是默认值。`blank_click_next_slide` 查询当前设置。点击空白处取消选择时不会推进演示。键盘和导航按钮不受此选项影响。

JSX 用于定义幻灯片中的 UI 内容；Reveal 将动作安排到演示的不同步骤。Standalone Reveal 独立声明，用于图元等已有对象；JSX Reveal 写在 UI 元素内部，作用于它的直接父元素。

## Reveal 步骤

步骤 ID 可以是 `start` 或以点分隔的非负整数组成的编号，例如 `1`、`2.1`、`2.10`。`start` 在其他步骤之前执行，编号按数字分段排序。同一 ID 的 Standalone Reveal 与 JSX Reveal 同时执行，回退时一起撤销。`start` 的动作立即生效。

## Standalone Reveal

在 REPL 中使用 `reveal <动作> at <步骤ID>`。目标必须是已定义的对象；`set` 的目标必须是滑动条。

| 动作 | 语法 | 作用 |
| --- | --- | --- |
| 显示 | `reveal show 对象 [in 时长] at ID` | 显示对象 |
| 隐藏 | `reveal hide 对象 [in 时长] at ID` | 隐藏对象 |
| 绘制 | `reveal draw 图元 [in 时长] at ID` | 显示平面图元并播放绘制过程 |
| 颜色 | `reveal color 图元 with #十六进制颜色 [in 时长] at ID` | 改变图元颜色 |
| 赋值 | `reveal set 滑动条 to 数值表达式 [in 时长] at ID` | 将滑动条值变化到目标值 |

方括号表示可省略，不需要实际输入。时长可写为 `0.5s`、`1m`、`1h`，省略单位时按秒计算。显示、隐藏、绘制和赋值省略时长时默认为 1 秒；颜色省略时长时立即改变。`start` 均立即执行。`draw` 只接受平面图元，回退步骤时恢复动作前的显示状态和绘制进度。绘制效果的当前支持范围见 `help animation`。

```text
reveal hide A at start
reveal draw A in 0.5s at 1
reveal color A with #ff0000 in 1s at 2
reveal set t to 3 in 2s at 2.1
reveal_list
del_reveal 2.1
```

`reveal_list` 列出独立声明；`del_reveal` 按 ID 删除独立声明，同一 ID 的独立动作都会删除。它们不管理 JSX 内联动作。

## JSX 基本语法

JSX 是 Algeo 表达式，可以赋给名称。标签可以嵌套，成对标签必须匹配，也可使用自闭合标签。属性值使用字符串或花括号内的 Algeo 表达式；布尔属性可简写，`hidden` 等价于 `hidden={true}`。

```text
标题 := <Text fontSize={24} color="#3366ff">你好，{1 + 2}</Text>
内容 := <VStack>
  <Text>第一行</Text>
  <Text hidden>第二行</Text>
  <Formula latex="x^2 + y^2" />
</VStack>
```

子节点可以是文本、嵌套元素或 `{表达式}`；表达式的结果必须能转换为该组件接受的子节点类型。例如数字和布尔值可在 `Text` 中转换为文本。多行文本的缩进和空行会被清理，非空行之间以空格连接；需要明确空格或换行时可写 `{" "}` 或 `{"\n"}`。JSX 与 React 类似，但表达式使用 Algeo 语法，不能假定支持任意 HTML 标签或 React 特性。

## JSX Reveal

`<Reveal>` 必须是支持动画的 UI 元素的直接子节点，不显示为内容；其中可以连续写多个动作。动作作用于包含它的元素，而非其兄弟节点。

| 动作 | 语法 | 作用 |
| --- | --- | --- |
| 显示 | `show at ID` | 显示父元素 |
| 隐藏 | `hide at ID` | 隐藏父元素 |
| 颜色 | `color with #十六进制颜色 [in 时长] at ID` | 改变父元素颜色 |

显示和隐藏在非 `start` 步骤使用 1 秒过渡，不能指定 `in`；颜色省略时长时立即改变。`start` 动作立即执行。颜色字面量使用 `#` 加十六进制数字。

```text
标题 := <Text color="#222222">
  <Reveal>
    hide at start
    show at 1
    color with #ff0000 in 0.5s at 2
    hide at 3
  </Reveal>
  演示标题
</Text>
```

## 内置 JSX 组件和属性

组件也可写为 `Ui.Text`、`Ui.VStack`、`Ui.HStack`、`Ui.Formula`。以下是面向使用的属性；花括号中的数字和布尔值是表达式。

| 组件 | 子节点 | 属性 |
| --- | --- | --- |
| `Text` | 文本、可转为文本的表达式、嵌套 UI 元素 | `font`（字体字符串）、`fontSize`（数字或字符串）、`color`（颜色）、`lineHeight`（数字或字符串）、`opacity`（数字）、`textAlign`（`"left"`、`"center"`、`"right"`）、`hidden`（布尔值） |
| `VStack` | 可测量的 UI 元素，按纵向排列 | `gap`、`alignItems`、`justifyContent`、`hidden`、`opacity`、`color` |
| `HStack` | 可测量的 UI 元素，按横向排列 | `gap`、`alignItems`、`justifyContent`、`hidden`、`opacity`、`color` |
| `Formula` | 不使用普通文本子节点；通过 `latex` 指定内容 | `latex`（LaTeX 字符串）、`hidden`（布尔值）、`opacity`（数字）、`color`（颜色） |

颜色属性可写成字符串，如 `color="#ff0000"`，也可使用颜色表达式，如 `color={red}`。块级元素可放在 `Text` 内作为内联块。这些组件均支持上述 JSX Reveal 动作。`textAlign` 的其他字符串值按左对齐处理。

`Text` 也可以嵌套在另一个 `Text` 中，作为内联文本分别设置字体、颜色等文本样式。此时内层 `Text` 不作为块级元素处理，其宽高、背景、圆角、边框、padding、margin、`alignSelf` 和 `flex` 等块级属性不会生效。

这些组件作为块级元素时均支持以下属性：

- `width`、`height`：指定宽高，包含 padding。
- `backgroundColor`、`borderRadius`：背景色和圆角半径。
- `borderColor`、`borderWidth`：边框颜色和粗细；边框按外轮廓绘制，不占布局空间。
- `padding`、`paddingLeft`、`paddingRight`、`paddingTop`、`paddingBottom`：内边距。
- `margin`、`marginLeft`、`marginRight`、`marginTop`、`marginBottom`：位于宽高之外的外边距。
- `alignSelf`：覆盖父容器的交叉轴默认对齐方式。
- `flex`：按比例分配父容器主轴上的剩余空间；基准尺寸为元素的测量尺寸。

除颜色和 `alignSelf` 外，这些属性的值均为数字。`padding` 和 `margin` 分别同时设置四边，之后可用单边属性覆盖。

`VStack` 和 `HStack` 的 `alignItems` 设置子元素在交叉轴上的默认对齐方式；子元素可通过 `alignSelf` 覆盖。支持 `"start"`、`"center"`、`"end"` 和 `"stretch"`，未指定时默认为 `"stretch"`。交叉轴在 `VStack` 中为水平方向，在 `HStack` 中为垂直方向。

`VStack` 和 `HStack` 的 `gap` 是相邻子元素之间的间距，默认为 `0`。`justifyContent` 设置主轴上的子元素排列方式，支持 `"start"`、`"center"`、`"end"`、`"space-between"`、`"space-around"` 和 `"space-evenly"`，默认为 `"start"`。主轴在 `VStack` 中为垂直方向，在 `HStack` 中为水平方向；子元素使用 `flex` 时，剩余空间先按 flex 分配。

`space-evenly` 将剩余空间平均分给两端及相邻子元素之间；`space-around` 则让两端各分到元素之间的一半。指定 `gap` 时，元素之间还会保留这部分固定间距。
