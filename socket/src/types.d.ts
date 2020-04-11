import WebSocket = require('ws');

declare module 'ws' {
  interface ResponseAPI {
    ws: WebSocket;
    sendJSON: (data: unknown) => void;
    sendAllJSON: (data: unknown) => void;
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
    use<T>(action: string, handler: SocketHandler<T>): void;
  }
}

export = WebSocket;
