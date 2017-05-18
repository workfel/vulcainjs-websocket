import { IContainer } from 'vulcain-corejs';
import { IWs } from './wsAdapter';

export class WebSocketComponent {


    /**
     * 
     * @param container 
     * @param io 
     * @param services This is a list of websocket service who will be listened
     */
    constructor(private container: IContainer, private io: SocketIO.Server, private services: Array<string>) {
        this.initialize();
    }
    /**
     * 
     * @param socket 
     */
    newSocketHappen(socket: SocketIO.Socket) {
        // Loop on all service to attach the new socket
        this.services.forEach((serviceName: string) => {
            // Use the container to load the instance of service
            let service = this.container.get<IWs>(serviceName);
            service.init(this.io, socket);
            // Listen eventName on socket
            // https://socket.io/docs/server-api/#socket-on-eventname-callback
            socket.on(service.onSetEventName(), (msg) => {
                service.onCall(msg);
            });
        });
    }

    private initialize() {

    }


    private initAllRooms() {

    }
}