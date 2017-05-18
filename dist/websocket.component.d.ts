/// <reference types="socket.io" />
import { IContainer } from 'vulcain-corejs';
export declare class WebSocketComponent {
    private container;
    private io;
    private services;
    constructor(container: IContainer, io: SocketIO.Server, services: Array<string>);
    newSocketHappen(socket: SocketIO.Socket): void;
    private initialize();
    private initAllRooms();
}
