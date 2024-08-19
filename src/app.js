/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
        transports: ['websocket'],
        rejectUnauthorized: false,
      })
    );
    this.server.use(express.json());
    this.server.use(bodyParser.json());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
