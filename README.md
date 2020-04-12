# Online textarea 

:notebook: This project allows to synchronize text editing for multiple users in real-time.  

### How to bootstrap application

- `npm i && lerna bootstrap` - setup project's dependencies;
- `cd backend && npm start` - run NodeJS server;
- `cd client && npm start` - run client with webpack dev server;

##### Run application in LAN or WAN

The application works locally by default.  
To check it out with friends clone `client/.env.example` and rename it to `.env`.  
Change `SOCKET_SERVER` value to match you LAN or WAN IP.

### Implemented features

##### General

- Typescript;
- Multirepo under Lerna control;
- Code quality tools:
  - Prettier;
  - ESLint (airbnb styleguide);
  - pre-commit (lint) and pre-push (tests) hooks are used;

##### Server side

- :heavy_check_mark: Store text in file. It can be found in `backend/storage/text`;
- :heavy_check_mark: Accept socket connections;
- :heavy_check_mark: Apply text patches and notify clients on update;
- :heavy_check_mark: Execute typescript with `ts-node`;
- :heavy_check_mark: Utilize `nodemon` to speed up development;

##### Client application

- :heavy_check_mark: React UI;
- :heavy_check_mark: Use custom Webpack configuration;
- :heavy_check_mark: Send updates with debounce to prevent socket from spamming;
- :heavy_check_mark: Compile typescript with `babel`;
- :heavy_check_mark: Utilize WebWorker for heavy calculations;

:warning: Note:

    For sharing data between main thread and worker's - the Transferable object is used.
    This approach does not enable structural copy algorithm.
    I found this solution more applicable for current case.

##### Socket library

- :heavy_check_mark: Organize in an isomorphic style (different entry points for server and browser);
  Actually, it has more functionality for the backend side.  
  Several methods have been added to simulate the `.use` pattern.
- :heavy_check_mark: Extract to the separate library and use on the client and server side.

##### Text difference library

- :heavy_check_mark: Written in TDD style, 100% covered with tests.
- :heavy_check_mark: Extract to the separate library and use on the client and server side.
