import React, { ChangeEvent, useCallback } from 'react';
import { getPatch, getTextDiff } from 'text-diff';

import { useSocket } from '@hooks/useSocket';

import styles from './TextInput.module.scss';

export const TextInput = (): JSX.Element => {
  const [text = '', sendPatch] = useSocket<string>('TEXT');

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
      const patch = getPatch(getTextDiff(text, target.value));
      sendPatch(patch);
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
