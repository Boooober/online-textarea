import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { applyTextPatch, getPatch, getTextDiff, Patch } from 'text-diff';

import { useSocket } from '@hooks/useSocket';

import styles from './TextInput.module.scss';

export enum TextEvent {
  Update = 'TEXT.UPDATE'
}

export const TextInput = (): JSX.Element => {
  const [text, setText] = useState('');
  const [patch, sendPatch] = useSocket<Patch>(TextEvent.Update);

  useEffect(() => {
    if (patch) {
      setText(applyTextPatch(text, patch));
    }
  }, [patch]);

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
      const newPatch = getPatch(getTextDiff(text, target.value));
      sendPatch(newPatch);
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
