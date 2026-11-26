# 课件音效

规划课件时标出需要声音的事件，从下表选取语义 ID。判题结果、揭示步骤和计时状态由课件逻辑提供，音效随可见反馈触发。

## 现有音频与触发时机

下表的文件都在 [音效素材目录](../assets/sound-effects/)。同一语义有多个候选时，制作阶段为整份课件随机抽一段。

| 语义 ID | 触发时机 | 候选文件 |
| --- | --- | --- |
| `correct` | 一次有效提交被判定为正确 | [`答对·近处轻响.mp3`](../assets/sound-effects/答对·近处轻响.mp3) |
| `incorrect` | 一次有效提交被判定为错误，与订正提示同步 | [`incorrect--dialog-error.wav`](../assets/sound-effects/incorrect--dialog-error.wav)、[`incorrect--dialog-error-serious.wav`](../assets/sound-effects/incorrect--dialog-error-serious.wav)、[`incorrect--dialog-error-critical.wav`](../assets/sound-effects/incorrect--dialog-error-critical.wav) |
| `highlight` | 首次揭示关键条件、公式或推理依据时，与视觉高亮同步 | [`重点提示.mp3`](../assets/sound-effects/重点提示.mp3) |
| `tick` | 倒数进入最后 3、2、1 秒时各播放一次 | [`倒计时-木鱼一声.wav`](../assets/sound-effects/倒计时-木鱼一声.wav) |
| `time-up` | 一轮计时归零并显示到时状态时播放一次 | [`doorbell.wav`](../assets/sound-effects/doorbell.wav) |
| `click` | 需要强化按钮操作反馈时 | [`按钮点击.mp3`](../assets/sound-effects/按钮点击.mp3) |
| `confirm` | 设置或操作确认成功时，例如应用计时设置 | [`点击 确认.mp3`](../assets/sound-effects/点击%20确认.mp3) |

空提交、格式错误和未作答超时使用各自的可见反馈。一次操作触发多种反馈时，优先播放判题、揭示或计时结果对应的音效。普通翻页和恢复画面状态保持安静。

## 生成单文件 HTML

在 skill 根目录运行 [选音脚本](../scripts/select-sound-effects.cjs)，参数为课件实际用到的语义 ID。带答题反馈、重点揭示和完整倒数提示的课件可以这样调用：

```sh
node scripts/select-sound-effects.cjs correct incorrect highlight tick time-up
```

脚本输出按语义 ID 索引的 Data URL JSON。把输出写入 HTML 脚本的 `cueUrls`，让同一份课件的全部页面共用这份映射。继续完善预览或局部修改时，沿用已选的音效，仅为新增语义再运行脚本。缺素材时脚本会提示并省略对应键，课件照常显示反馈。交付前用 `file://` 打开 HTML，确认音频直接从内嵌数据播放。

新增候选时，把 WAV、MP3 或 OGG 直接放在[音效素材目录](../assets/sound-effects/)中，命名为 `<语义 ID>--<自定名称>.<扩展名>`，例如 `time-up--铃声.wav`。可用 `--assets-dir <目录>` 选择其他素材库，脚本也支持已有的语义子目录。分发课件时按素材许可处理。

## 绑定课件事件

提供一个可用键盘操作的声音开关，初始开启，设置 `aria-pressed="true"` 并在状态变化时同步更新。页面加载保持安静。首次点击或键盘操作触发答题反馈或关键揭示时，直接在该交互的事件处理函数中播放。浏览器可能拒绝播放，文字反馈和计时照常工作。目标浏览器无法解码 Ogg 时，可在制作时转为 WAV，并将 Data URL 的类型改为 `audio/wav`。 [Chrome 自动播放规则](https://developer.chrome.com/blog/autoplay/)

将下方函数接到课件已有的事件处理逻辑。声音开关调用 `setEnabled()`；更新画面后用 `playCue('incorrect')` 等调用播放对应语义；切页时调用 `stopCue()`。所有事件共用一个音频对象，避免叠放。

```js
// cueUrls 是以事件 ID 为键、以内嵌 Data URL 为值的对象。
function createLessonSound(cueUrls) {
  const audio = new Audio();
  audio.volume = 0.3;
  let enabled = true;

  function stopCue() {
    audio.pause();
  }

  function setEnabled(value) {
    enabled = value;
    if (!enabled) stopCue();
  }

  function playCue(id) {
    if (!enabled || !Object.hasOwn(cueUrls, id)) return;
    if (!audio.paused && id === 'tick') return;
    stopCue();
    const source = cueUrls[id];
    if (audio.getAttribute('src') === source) {
      audio.currentTime = 0;
    } else {
      audio.src = source;
    }
    audio.play().catch(() => {});
  }

  return { setEnabled, playCue, stopCue };
}
```

倒数使用课件已有的计时器。剩余秒数进入 3、2、1 时更新屏幕并调用 `playCue('tick')`。每轮首次归零时显示到时状态，再调用 `playCue('time-up')`。页面恢复时直接采用当前秒数，跳过已错过的提示。暂停、重置和切页时停止计时回调和当前音效，恢复或重开时按实际计时状态继续。

确认声音开关默认开启，加载时安静，首次相关操作无需先点声音开关即可同步播放。复验关闭立即停声、重新开启后下一次相关操作恢复播放，以及切页后无残留提示。选用了到时音时，确认每轮归零只响一次。静音或播放失败时，答题结果、重点与剩余时间仍应可见。
