import { App } from './app/app';
import * as io from 'socket.io-client';

const socket = io('http://localhost:3002')
const app = new App('Stuff', socket);

app.run();
