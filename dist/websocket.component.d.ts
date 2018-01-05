/// <reference types="socket.io" />
import { IContainer } from 'vulcain-corejs';
import { IWs } from './wsAdapter';
export declare class WebSocketComponent {
    private container;
    private io;
    private services;
    /**
     *
     * @param container
     * @param io
     * @param services This is a list of websocket service who will be listened
     */
    constructor(container: IContainer, io: SocketIO.Server, services: Array<IWs>);
    /**
     *
     * @param socket
     */
    newSocketHappen(socket: SocketIO.Socket, user?: any): void;
    private initialize();
    private initAllRooms();
}
