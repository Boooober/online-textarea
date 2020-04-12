import WebSocket from 'socket';

import { onlineText, TextEvent } from './socket-api/online-text';

export const setupServer = (): void => {
  const wss = new WebSocket.Server({ port: 9002 });
  wss.use(TextEvent.Update, onlineText);

  // eslint-disable-next-line no-console
  console.log('Server is up and running');
};
