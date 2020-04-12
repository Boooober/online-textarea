import { useCallback, useEffect, useState } from 'react';
import WebSocket, { MessageEvent } from 'socket';

const ws = new WebSocket(process.env.SOCKET_SERVER as string);

const createSelector = <T>(type: string, next: (payload: T) => void) => (message: MessageEvent): void => {
  const action = JSON.parse(message.data as string);
  if (action.type === type) {
    next(action.payload as T);
  }
};

export const useSocket = <T>(type: string): [T | undefined, (payload: unknown) => void] => {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const selector = createSelector(type, setValue);

    ws.addEventListener('message', selector);
    return (): void => ws.removeEventListener('message', selector);
  }, []);

  return [value, useCallback((payload: unknown) => ws.send(JSON.stringify({ type, payload })), [])];
};
