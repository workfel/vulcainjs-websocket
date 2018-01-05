import { AbstractAdapter, IContainer } from 'vulcain-corejs';
export declare class WebSocketService {
    private services;
    private container;
    private io;
    private tokenService;
    private acceptUnauthorizedConnections;
    private timeToAuthorizeConnectionInMs;
    private authorizedSockets;
    private securityDisabled;
    private ws;
    /**
     *
     * @param container
     * @param server The instance of express Server to attach socket.io on it
     * @param services This is a list of websocket service who will be listened
     */
    start(container: IContainer, server: AbstractAdapter, services: Array<string>): void;
    private initializeListener();
    private checkAndInitializeSocket(socket);
    private initializeServices(services);
    private getUserToken(socket, token);
    private startSocketAuthentication(socket);
}
