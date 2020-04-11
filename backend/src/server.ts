import http from 'http';
import WebSocket from 'socket';
import express, { Express } from 'express';

import { onlineText, TextEvent } from './socket-api/online-text';

export const setupServer = (): Express => {
  const port = 9002;
  const wsPort = 9003;
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const wss = new WebSocket.Server({ server: http.createServer(server), port: wsPort });
  wss.use(TextEvent.Update, onlineText);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.info(`Server is running on port ${port}!`);
  });

  return server;
};
