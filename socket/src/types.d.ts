import WebSocket = require('ws');

declare module 'ws' {
  interface ResponseAPI {
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

  interface Server {
    sendJSON(sessionId: string, data: unknown): void;
    sendJSONToAll(data: unknown): void;
    sendJSONToOther(excludeIds: string | string[], data: unknown): void;
    use<T>(action: string, handler: SocketHandler<T>): void;
  }
}

export = WebSocket;
