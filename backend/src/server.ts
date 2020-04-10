import http from 'http';
import WebSocket from 'isomorphic-ws';
import express, { Express } from 'express';

import { socketApi } from './socket-api';

export const setupServer = (): Express => {
  const port = 9002;
  const wsPort = 9003;
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const wss = new WebSocket.Server({ server: http.createServer(server), port: wsPort });
  socketApi(wss);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.info(`Server is running on port ${port}!`);
  });

  return server;
};
