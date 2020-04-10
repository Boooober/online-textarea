import WebSocket from 'isomorphic-ws';
import { v4 } from 'uuid';

import { onlineText, SocketHandler, WSResponse } from './online-text';

export const socketApi = ((handlers: { [key: string]: SocketHandler }) => (wss: WebSocket.Server): void => {
  const sessions = new Map<string, WebSocket>();

  const send = (sessionId: string, data: unknown): void => sessions.get(sessionId)?.send(JSON.stringify(data));
  const sendAll = (data: unknown): void => sessions.forEach((_: WebSocket, sessionId: string) => send(sessionId, data));

  wss.on('connection', (ws: WebSocket) => {
    const sessionId = v4();
    sessions.set(sessionId, ws);
    // eslint-disable-next-line no-console
    console.info('New connection', sessionId);

    const wsResponse = { sendAll, send: send.bind(sessionId) } as WSResponse;

    Object.values(handlers).forEach(({ hydration }) => hydration(wsResponse));

    ws.on('message', (message: WebSocket.Data) => {
      try {
        const action = JSON.parse(message as string);
        handlers?.[action.type](action, wsResponse);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Unable to process message`, message);
      }
    });
    ws.on('close', () => {
      sessions.delete(sessionId);
    });
  });
})({
  TEXT: onlineText
});
