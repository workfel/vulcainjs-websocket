import {AbstractAdapter, IContainer, IDynamicProperty, Inject, System} from 'vulcain-corejs';
import {Injectable, LifeTime} from 'vulcain-corejs/dist';
//
import {WebSocketComponent} from "./websocket.component";
import {TokenService} from "vulcain-corejs/dist/defaults/services/tokenService";
import {IWs} from "./wsAdapter";
import Socket = SocketIO.Socket;
import {Observable} from "rxjs";

const SocketIo = require('socket.io');

@Injectable(LifeTime.Singleton, 'WebSocketService')
export class WebSocketService {
    private services: IWs[] = [];
    private container: IContainer;

    private io: SocketIO.Server;
    private tokenService: TokenService;
    private acceptUnauthorizedConnections: IDynamicProperty<string>;
    private timeToAuthorizeConnectionInMs: IDynamicProperty<number>;
    private authorizedSockets: any = {};
    private securityDisabled: IDynamicProperty<string>;
    private ws: WebSocketComponent;

    /**
     *
     * @param container
     * @param server The instance of express Server to attach socket.io on it
     * @param services This is a list of websocket service who will be listened
     */
    start(container: IContainer, server: AbstractAdapter, services: Array<string>) {
        this.container = container;
        this.io = new SocketIo(server);

        this.tokenService = this.container.get<TokenService>('TokenService');
        this.acceptUnauthorizedConnections = System.createServiceConfigurationProperty("WEBSOCKET_ACCEPT_UNAUTHORIZED_CONNECTIONS", "true");
        this.timeToAuthorizeConnectionInMs = System.createServiceConfigurationProperty("WEBSOCKET_TIME_TO_AUTHORIZE_CONNECTIONS", 1);
        this.securityDisabled = System.createServiceConfigurationProperty("WEBSOCKET_DISABLE_SECURITY", "false");
        // this.container.injectFrom(pathWs);
        this.initializeServices(services);
        this.ws = new WebSocketComponent(this.container, this.io, this.services);
        this.initializeListener();
    }

    private initializeListener() {
        this.io.on('connection', async (socket) => {
            if (this.securityDisabled.value === "true") {
                this.ws.newSocketHappen(socket);
            }
            else {
                this.startSocketAuthentication(socket);
            }
        });
    }

    private checkAndInitializeSocket(socket: Socket) {
        socket.emit('time_to_authorize_expired');
        if (this.authorizedSockets[socket.id]) {
            // Do nothing, socket is open already
        }
        else if (this.acceptUnauthorizedConnections.value === "true") {
            socket.emit("authorized", {user: 'anonymous'});
            this.ws.newSocketHappen(socket);
        }
        else {
            socket.disconnect(true);
        }
        // whatever happens, remove socket id from list, we don't need to keep it for long
        this.authorizedSockets[socket.id] = null;
    }

    private initializeServices(services: string[]) {
        services.forEach((serviceName: string) => {
            let service = this.container.get<IWs>(serviceName);
            service.init(this.io);
            this.services.push(service);
        });
    }

    private async getUserToken(socket: Socket, token: string) {
        // get tokenservice or return null
        if (!this.tokenService) {
            return;
        }
        try {
            // resolve token or return null
            let user: any = await this.tokenService.verifyTokenAsync({token: token, tenant: ""});
            this.authorizedSockets[socket.id] = user;
            this.ws.newSocketHappen(socket, this.authorizedSockets[socket.id]);
            socket.emit("authorized", user);
        }
        catch (error) {
            socket.emit('invalid_token');
            return;
        }
    }

    private startSocketAuthentication(socket: SocketIO.Socket) {
        // 1) Instantiate a listener for token
        socket.on('authorize', async (message) => {
            if (message.token && message.token.startsWith("Bearer ")) {
                await this.getUserToken(socket, message.token.split(" ")[1]); // Removing the "Bearer " part
            }
            else {
                socket.emit('invalid_token');
            }
        });
        // 2) start timer
        Observable.timer(this.timeToAuthorizeConnectionInMs.value).subscribe(() => {
            this.checkAndInitializeSocket(socket);
        });
        // 3) and tell socket
        socket.emit(`authorize`, {timeToAuthorize: this.timeToAuthorizeConnectionInMs.value});
        if ((this.acceptUnauthorizedConnections.value === "false")) {
            socket.emit(`unauthorized_connections`, {accepted: false});
        }
        else {
            socket.emit(`unauthorized_connections`, {accepted: true});
        }
    }
}
