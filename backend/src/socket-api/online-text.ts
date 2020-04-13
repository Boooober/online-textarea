import path from 'path';
import { promises as fs } from 'fs';
import debounce from 'debounce-promise';

import { SocketHandler, ResponseAPI, SocketAction } from 'socket';
import { applyTextPatch, Patch } from 'text-diff';

const textAPI = ((): {
  read(filename: string): Promise<string>;
  write(filename: string, text: string): Promise<void>;
} => {
  let cachedText: string | null = null;

  const DIRNAME = '../../storage/text/';
  return {
    read: async (filename: string): Promise<string> => {
      if (cachedText === null) {
        try {
          const filePath = path.resolve(__dirname, DIRNAME, filename);
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          cachedText = await fs.readFile(filePath, 'utf8');
          // eslint-disable-next-line no-console
          console.log('Content has been loaded from file');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Unable to load file: ${filename}. Possibly, it does not exists yet.`);
          cachedText = '';
        }
      }

      return cachedText;
    },
    write: debounce(async (filename: string, text: string): Promise<void> => {
      cachedText = text;

      try {
        const filePath = path.resolve(__dirname, DIRNAME, filename);
        await fs.writeFile(filePath, text, 'utf8');
        // eslint-disable-next-line no-console
        console.log('File has been successfully updated');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Unable to write to file: ${filename}`, error);
      }
    }, 2000)
  };
})();

export enum TextEvent {
  Update = 'TEXT.UPDATE'
}

const FILENAME = 'online-text.txt';
export const onlineText: SocketHandler<Patch> = Object.assign(
  async (action: SocketAction<Patch>, { sendJSONToOther }: ResponseAPI): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Apply patch:', action.payload);
    const text = applyTextPatch(await textAPI.read(FILENAME), action.payload);
    sendJSONToOther(action);
    await textAPI.write(FILENAME, text);
  },
  {
    hydration: async ({ sendJSON }: ResponseAPI): Promise<void> => {
      sendJSON({
        type: TextEvent.Update,
        payload: {
          from: 0,
          to: Number.MAX_SAFE_INTEGER,
          updates: await textAPI.read(FILENAME)
        } as Patch
      });
    }
  }
);
