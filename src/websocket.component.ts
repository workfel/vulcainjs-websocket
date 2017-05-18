import { IContainer } from 'vulcain-corejs';
import { IWs } from './wsAdapter';

export class WebSocketComponent {



    constructor(private container: IContainer, private io: SocketIO.Server, private services: Array<string>) {
        this.initialize();
    }

    newSocketHappen(socket: SocketIO.Socket) {
        this.services.forEach((serviceName: string) => {
            let service = this.container.get<IWs>(serviceName);
            service.init(this.io, socket);
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