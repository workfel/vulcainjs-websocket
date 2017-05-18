import { AbstractAdapter, IContainer } from 'vulcain-corejs';
import { Injectable, LifeTime } from 'vulcain-corejs/dist';
//
import { WebSocketComponent } from "./websocket.component";

const SocketIo = require('socket.io');

@Injectable(LifeTime.Singleton, 'WebSocketService')
export class WebSocketService {
    private services: string[];
    private container: IContainer;

    private io: SocketIO.Server;

    /**
     * 
     * @param container 
     * @param server The instance of express Server to attach socket.io on it
     * @param services This is a list of websocket service who will be listened
     */
    start(container: IContainer, server: AbstractAdapter, services: Array<string>) {
        this.container = container;
        this.io = new SocketIo(server);
        this.services = services;

        // this.container.injectFrom(pathWs);

        this.initializeListener();
    }

    private initializeListener() {
        let ws = new WebSocketComponent(this.container, this.io, this.services);
        this.io.on('connection', (socket) => {
            // console.log('User connected');
            ws.newSocketHappen(socket);
        });
    }
}