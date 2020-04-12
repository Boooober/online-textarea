import { SocketHandler, ResponseAPI, SocketAction } from 'socket';
import { applyTextPatch, Patch } from 'text-diff';

export enum TextEvent {
  Update = 'TEXT.UPDATE'
}

export const onlineText = ((): SocketHandler<Patch> => {
  let text = '';

  return Object.assign(
    (action: SocketAction<Patch>, { sendJSONToOther }: ResponseAPI): void => {
      // eslint-disable-next-line no-console
      console.log('Apply patch:', action.payload);
      text = applyTextPatch(text, action.payload);
      sendJSONToOther(action);
    },
    {
      hydration: ({ sendJSON }: ResponseAPI): void => {
        sendJSON({
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
