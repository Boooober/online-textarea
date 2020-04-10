import { applyTextPatch, Patch } from 'text-diff';

export interface WSResponse {
  send: (data: unknown) => void;
  sendAll: (data: unknown) => void;
}

export interface SocketHandler {
  (action: { type: string; payload: any }, response: WSResponse): void;
  hydration(response: WSResponse): void;
}

export const onlineText = ((): SocketHandler => {
  let text: string = '';

  return Object.assign(
    (action: { type: string; payload: Patch }, { sendAll }: WSResponse): void => {
      text = applyTextPatch(text, action.payload);
      sendAll({ type: 'TEXT', payload: text });
    },
    {
      hydration: ({ sendAll }: WSResponse): void => {
        sendAll({ type: 'TEXT', payload: text });
      }
    }
  );
})();
