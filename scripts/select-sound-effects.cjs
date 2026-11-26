const { randomInt } = require('node:crypto');
const { readFileSync, readdirSync } = require('node:fs');
const { extname, join } = require('node:path');

const cueIds = new Set(['correct', 'incorrect', 'highlight', 'tick', 'time-up', 'click', 'confirm']);
const existingAssets = new Map([
  ['correct', '答对·近处轻响.mp3'],
  ['highlight', '重点提示.mp3'],
  ['tick', '倒计时-木鱼一声.wav'],
  ['time-up', 'doorbell.wav'],
  ['click', '按钮点击.mp3'],
  ['confirm', '点击 确认.mp3'],
]);
const audioTypes = new Map([
  ['.wav', 'audio/wav'],
  ['.mp3', 'audio/mpeg'],
  ['.ogg', 'audio/ogg'],
]);

function listAudio(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && audioTypes.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function selectCues(args) {
  let assetsDir = join(__dirname, '..', 'capabilities', 'sound-effects', 'assets');
  if (args[0] === '--assets-dir') {
    assetsDir = args[1];
    args = args.slice(2);
  }
  if (!assetsDir || args.length === 0 || args.some((id) => !cueIds.has(id))) {
    throw new Error(`Usage: node select-sound-effects.cjs [--assets-dir DIR] <${[...cueIds].join('|')}> [...]`);
  }

  const flatFiles = listAudio(assetsDir);
  const selected = {};
  for (const id of new Set(args)) {
    const directory = join(assetsDir, id);
    const candidates = [
      ...flatFiles
        .filter((name) => name.startsWith(`${id}--`) || name === existingAssets.get(id))
        .map((name) => join(assetsDir, name)),
      ...listAudio(directory).map((name) => join(directory, name)),
    ];
    if (candidates.length === 0) {
      console.error(`No audio candidates for ${id}`);
      continue;
    }

    const filename = candidates[randomInt(candidates.length)];
    const audio = readFileSync(filename);
    if (audio.length === 0) throw new Error(`Empty audio file: ${filename}`);
    const type = audioTypes.get(extname(filename).toLowerCase());
    selected[id] = `data:${type};base64,${audio.toString('base64')}`;
  }
  return selected;
}

try {
  console.log(JSON.stringify(selectCues(process.argv.slice(2))));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
