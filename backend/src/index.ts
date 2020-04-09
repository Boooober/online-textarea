import { setupServer } from './server';

process.on('uncaughtException', (error: Error) => {
  // eslint-disable-next-line no-console
  console.error(`Uncaught exception ${error.message}`);
});

process.on('unhandledRejection', (reason: unknown) => {
  // eslint-disable-next-line no-console
  console.error(`Unhandled rejection ${reason}`);
});

setupServer();
