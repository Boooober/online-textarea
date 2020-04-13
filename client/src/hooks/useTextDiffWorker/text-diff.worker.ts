import { getPatch, getTextDiff } from 'text-diff';
import { readTextFromBuffer, writeTextToBuffer } from '@hooks/useTextDiffWorker/helpers';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', ({ data: { beforeBuffer, afterBuffer } }: MessageEvent) => {
  const before = readTextFromBuffer(beforeBuffer);
  const after = readTextFromBuffer(afterBuffer);

  const patch = getPatch(getTextDiff(before, after));
  if (patch) {
    const { updates, ...indices } = patch;
    const updatesBuffer = writeTextToBuffer(updates);
    ctx.postMessage({ updatesBuffer, ...indices }, [updatesBuffer]);
  }
});
