import React, { PropsWithChildren } from 'react';

import styles from './MiddleLayout.module.scss';

export const MiddleLayout = ({ children }: PropsWithChildren<{}>): JSX.Element => (
  <main className={styles.layout}>
    <div className={styles.content}>{children}</div>
  </main>
);
