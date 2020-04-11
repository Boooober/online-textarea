import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { applyTextPatch, Patch } from 'text-diff';

import { useSocket } from '@hooks/useSocket';
import { useTextDiffWorker } from '@hooks/useTextDiffWorker';

import styles from './TextInput.module.scss';

export enum TextEvent {
  Update = 'TEXT.UPDATE'
}

export const TextInput = (): JSX.Element => {
  const [text, setText] = useState('');
  const [socketPatch, sendPatch] = useSocket<Patch>(TextEvent.Update);
  const [workerPatch, calculatePatch] = useTextDiffWorker();

  useEffect(() => {
    if (socketPatch) {
      setText(applyTextPatch(text, socketPatch));
    }
  }, [socketPatch]);

  useEffect(() => {
    if (workerPatch) {
      sendPatch(workerPatch);
    }
  }, [workerPatch]);

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
      setText(target.value);
      calculatePatch(text, target.value);
    },
    [text]
  );

  return (
    <>
      <label className={styles.label} htmlFor="textarea">
        Here we go, online text editor!
        <textarea
          className={styles.textarea}
          name="textarea"
          id="textarea"
          onChange={handleChange}
          value={text}
          placeholder="You can edit shared document with your friend. Or two."
        />
      </label>
    </>
  );
};
