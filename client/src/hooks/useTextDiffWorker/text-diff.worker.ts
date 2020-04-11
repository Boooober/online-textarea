import { getPatch, getTextDiff } from 'text-diff';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', ({ data: { before, after } }: MessageEvent) => {
  ctx.postMessage(getPatch(getTextDiff(before, after)));
});
