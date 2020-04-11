import { useCallback, useEffect, useState } from 'react';
import { Patch } from 'text-diff';

// eslint-disable-next-line import/no-webpack-loader-syntax
import TextDiffWorker from 'worker-loader!./text-diff.worker';

type UseTextDiffWorkerAPI = [Patch | undefined, (before: string, after: string) => void];

export const createUseTextDiffWorker = (): (() => UseTextDiffWorkerAPI) => {
  const worker = new TextDiffWorker();

  return (): UseTextDiffWorkerAPI => {
    const [patch, setPatch] = useState<Patch>();

    const calculatePatch = useCallback(
      (before: string, after: string) => {
        worker.postMessage({ before, after });
      },
      [worker]
    );

    useEffect(() => {
      const handler = ({ data }: MessageEvent): void => setPatch(data);
      worker.addEventListener('message', handler);
      return (): void => worker.removeEventListener('message', handler);
    }, [worker]);

    return [patch, calculatePatch];
  };
};

export const useTextDiffWorker = createUseTextDiffWorker();
