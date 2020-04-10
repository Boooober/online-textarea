import React from 'react';

import { TextInput } from '@components/TextInput/TextInput';
import { MiddleLayout as Layout } from '@components/MiddleLayout/MiddleLayout';

import './styles.scss';

export const App = (): JSX.Element => (
  <Layout>
    <TextInput />
  </Layout>
);
