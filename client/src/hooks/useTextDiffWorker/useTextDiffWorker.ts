import { useCallback, useEffect, useState } from 'react';
import { Patch } from 'text-diff';

// eslint-disable-next-line import/no-webpack-loader-syntax
import TextDiffWorker from 'worker-loader!./text-diff.worker';
import { readTextFromBuffer, writeTextToBuffer } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounceWithParamMemo<T extends (...args: any[]) => any>(fn: T, memoParamsIndex: number[], wait: number): T {
  let timeoutId: number | null = null;
  let memoizedParams: unknown[];

  return ((...args: unknown[]): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    } else {
      memoizedParams = memoParamsIndex.map((memoIndex: number) => args[memoIndex]);
    }

    const params = Object.assign(args, memoizedParams);
    timeoutId = (setTimeout(() => {
      fn(...params);
      timeoutId = null;
      memoizedParams = [];
    }, wait) as unknown) as number;
  }) as T;
}

type UseTextDiffWorkerAPI = [Patch | undefined, (before: string, after: string) => void];

export const createUseTextDiffWorker = (): (() => UseTextDiffWorkerAPI) => {
  const worker = new TextDiffWorker();

  return (): UseTextDiffWorkerAPI => {
    const [patch, setPatch] = useState<Patch>();

    const calculatePatch = useCallback(
      // Always calculate diff against the less recent "before".
      // Skip all "before" text updates while debouncing, but always accept new "after"
      debounceWithParamMemo(
        (before: string, after: string) => {
          performance.mark('patch_calculating_start');
          const beforeBuffer = writeTextToBuffer(before);
          const afterBuffer = writeTextToBuffer(after);

          worker.postMessage({ beforeBuffer, afterBuffer }, [beforeBuffer, afterBuffer]);
        },
        [0],
        400
      ),
      []
    );

    useEffect(() => {
      const handler = ({ data: { updatesBuffer, ...indices } }: MessageEvent): void => {
        const newPatch: Patch = { ...indices, updates: readTextFromBuffer(updatesBuffer) };
        setPatch(newPatch);

        performance.mark('patch_calculating_end');
        performance.measure('patch_calculating', 'patch_calculating_start', 'patch_calculating_end');
        // eslint-disable-next-line no-console
        console.log('Patch generated:', newPatch, performance.getEntriesByName('patch_calculating', 'measure')[0]);
        performance.clearMarks();
        performance.clearMeasures();
      };
      worker.addEventListener('message', handler);
      return (): void => worker.removeEventListener('message', handler);
    }, []);

    return [patch, calculatePatch];
  };
};

export const useTextDiffWorker = createUseTextDiffWorker();
