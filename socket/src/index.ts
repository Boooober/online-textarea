import { v4 } from 'uuid';
import WebSocket from 'isomorphic-ws';

export interface ResponseAPI {
  ws: WebSocket;
  sendJSON: (data: unknown) => void;
  sendJSONToAll: (data: unknown) => void;
  sendJSONToOther: (data: unknown) => void;
}

interface SocketAction<T = unknown> {
  type: string;
  payload: T;
}

interface SocketHandler<T> {
  (action: SocketAction<T>, response: ResponseAPI): void;
  hydration?(response: ResponseAPI): void;
}

export class WebSocketServer extends WebSocket.Server {
  private readonly sessions = new Map<string, WebSocket>();

  sendJSON = (sessionId: string, data: unknown): void => {
    this.sessions.get(sessionId)?.send(JSON.stringify(data));
  };

  sendJSONToAll = (data: unknown): void => {
    this.sessions.forEach((_: WebSocket, sessionId: string) => this.sendJSON(sessionId, data));
  };

  sendJSONToOther = (excludeSessionId: string | string[], data: unknown): void => {
    const excludeIds = Array.isArray(excludeSessionId) ? excludeSessionId : [excludeSessionId];
    this.sessions.forEach((_: WebSocket, sessionId: string) => {
      if (!excludeIds.includes(sessionId)) {
        this.sendJSON(sessionId, data);
      }
    });
  };

  use<T>(type: string, handler: SocketHandler<T>): void {
    this.on('connection', (ws: WebSocket) => {
      const sessionId = v4();
      this.sessions.set(sessionId, ws);
      // eslint-disable-next-line no-console
      console.info(`New connection established:`, sessionId);

      const responseAPI = {
        ws,
        sendJSON: this.sendJSON.bind(null, sessionId),
        sendJSONToAll: this.sendJSONToAll,
        sendJSONToOther: this.sendJSONToOther.bind(null, sessionId)
      } as ResponseAPI;

      handler.hydration?.(responseAPI);

      ws.on('message', (message: WebSocket.Data) => {
        try {
          const action = JSON.parse(message as string);
          if (action.type === type) {
            handler(action, responseAPI);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Unable to process message:`, message);
        }
      });

      ws.on('close', () => {
        this.sessions.delete(sessionId);
        // eslint-disable-next-line no-console
        console.info(`Connection closed:`, sessionId);
      });
    });
  }
}

WebSocket.Server = WebSocketServer;

export default WebSocket;
