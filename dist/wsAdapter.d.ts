/// <reference types="socket.io" />
export interface IWs {
    init(io: SocketIO.Server, socket: SocketIO.Socket): void;
    /**
     *
     * @return {string} the name of room
     */
    onSetRoomName(): string;
    onSetEventName(): string;
    onCall(msg: any): void;
}
