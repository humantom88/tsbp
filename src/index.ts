import { App } from './app/app';
import { Config } from './app/config';
import * as io from 'socket.io-client';

const config : Config = {
    isServerClient: false,
    isVR: true
}

const socket = config.isServerClient
    ? io('http://localhost:3002')
    : null

const app = new App('Stuff', config, socket);

app.run();
