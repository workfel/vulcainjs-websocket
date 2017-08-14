/// <reference types="socket.io" />
export interface IWs {
    init(io: SocketIO.Server): void;
    onNewSocket(socket: SocketIO.Socket, user?: any): void;
    /**
     *
     * @return {string} the name of room
     */
    onSetRoomName(): string;
    onSetEventName(): string;
    onCall(msg: any, socket: SocketIO.Socket): void;
}
