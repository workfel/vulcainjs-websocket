import {IContainer} from 'vulcain-corejs';
import {IWs} from './wsAdapter';

export class WebSocketComponent {


    /**
     *
     * @param container
     * @param io
     * @param services This is a list of websocket service who will be listened
     */
    constructor(private container: IContainer, private io: SocketIO.Server, private services: Array<IWs>) {
        this.initialize();
    }

    /**
     *
     * @param socket
     */
    newSocketHappen(socket: SocketIO.Socket, user?: any) {
        // Loop on all service to attach the new socket
        this.services.forEach(async (service: IWs) => {
            await service.onNewSocket(socket, user);
            socket.on(service.onSetEventName(), (msg) => {
                service.onCall(msg, socket);
            });
        });
        socket.emit('ready');
    }

    private initialize() {

    }


    private initAllRooms() {

    }
}
