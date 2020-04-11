import { SocketHandler, ResponseAPI } from 'socket';
import { applyTextPatch, Patch } from 'text-diff';
import { SocketAction } from 'socket/src/types';

export enum TextEvent {
  Update = 'TEXT.UPDATE'
}

export const onlineText = ((): SocketHandler<Patch> => {
  let text = '';

  return Object.assign(
    (action: SocketAction<Patch>, { sendAllJSON }: ResponseAPI): void => {
      text = applyTextPatch(text, action.payload);
      sendAllJSON(action);
    },
    {
      hydration: ({ sendAllJSON }: ResponseAPI): void => {
        sendAllJSON({
          type: TextEvent.Update,
          payload: {
            from: 0,
            to: Number.MAX_SAFE_INTEGER,
            updates: text
          } as Patch
        });
      }
    }
  );
})();
