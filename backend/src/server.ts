import express, { Express } from 'express';

export const setupServer = (): Express => {
  const port = 9002;
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.info(`Server is running on port ${port}!`);
  });

  return server;
};
