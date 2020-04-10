import { useCallback, useEffect, useState } from 'react';

interface SocketDTO {
  type: string;
  payload?: unknown;
}

type SocketCallback = (message: SocketDTO) => unknown;

class FakeSocket {
  private handlers: SocketCallback[] = [];

  onmessage(callback: SocketCallback): () => void {
    this.handlers.push(callback);

    return (): void => {
      this.handlers.filter((handler: SocketCallback) => handler !== callback);
    };
  }

  sendMessage(message: SocketDTO): void {
    this.handlers.forEach((handler: SocketCallback) => handler(message));
  }
}
const ws = new FakeSocket();
setInterval(() => {
  if (Math.round(Math.random())) {
    ws.sendMessage({
      type: 'ping',
      payload: 'This is a ping message'
    });
  } else {
    ws.sendMessage({
      type: 'TEXT',
      payload: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lobortis consequat augue sed finibus. ${Math.random()}`
    });
  }
}, 2500);

const createSelector = <T>(type: string, next: (payload: T) => void) => (message: SocketDTO): void => {
  if (message.type === type) {
    next(message.payload as T);
  }
};

export const useSocket = <T>(type: string): [T | void, (payload: unknown) => void] => {
  const [value, setValue] = useState<T>();

  useEffect(() => ws.onmessage(createSelector(type, setValue)));

  return [value, useCallback((payload: unknown) => ws.sendMessage({ type, payload }), [])];
};
