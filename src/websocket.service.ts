import { AbstractAdapter, IContainer } from 'vulcain-corejs';
import { Injectable, LifeTime } from 'vulcain-corejs/dist';
//
import {  WebSocketComponent} from "./websocket.component";

const SocketIo = require('socket.io');

@Injectable(LifeTime.Singleton, 'WebSocketService')
export class WebSocketService {
    private services: string[];
    private container: IContainer;

    private io: SocketIO.Server;

    /**
     *
     * @param io the io server
     * @param pathWs the path to scan folder with all socket io services
     */
    // constructor(private container: IContainer, server: AbstractAdapter, private pathWs: string = 'ws') {
    //     this.io = new SocketIo(server);
    // }

    start(container: IContainer, server: AbstractAdapter, services: Array<string>, pathWs: string = 'ws') {
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