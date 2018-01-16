// @flow

import { App } from './app';
import * as io from 'socket.io-client';

// const socket = io('http://localhost:3002');
// const app = new main.App('Stuff', socket);

const app = new App('Stuff');

app.run();
