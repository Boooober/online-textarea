import React, { ChangeEvent, useCallback } from 'react';

import styles from './TextInput.module.scss';

export const TextInput = (): JSX.Element => {
  const handleChange = useCallback(({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line no-console
    console.log(target.value);
  }, []);

  return (
    <>
      <label className={styles.label} htmlFor="textarea">
        Here we go, online text editor!
        <textarea
          className={styles.textarea}
          name="textarea"
          id="textarea"
          onInput={handleChange}
          placeholder="You can edit shared document with your friend. Or two."
        />
      </label>
    </>
  );
};
