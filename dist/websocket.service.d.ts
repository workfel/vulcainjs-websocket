import { AbstractAdapter, IContainer } from 'vulcain-corejs';
export declare class WebSocketService {
    private services;
    private container;
    private io;
    /**
     *
     * @param io the io server
     * @param pathWs the path to scan folder with all socket io services
     */
    start(container: IContainer, server: AbstractAdapter, services: Array<string>, pathWs?: string): void;
    private initializeListener();
}
