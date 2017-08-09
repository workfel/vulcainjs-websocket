"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketComponent {
    /**
     *
     * @param container
     * @param io
     * @param services This is a list of websocket service who will be listened
     */
    constructor(container, io, services) {
        this.container = container;
        this.io = io;
        this.services = services;
        this.initialize();
    }
    /**
     *
     * @param socket
     */
    newSocketHappen(socket, user) {
        // Loop on all service to attach the new socket
        this.services.forEach((service) => {
            service.onNewSocket(socket, user);
            socket.on(service.onSetEventName(), (msg) => {
                service.onCall(msg);
            });
        });
        socket.emit('ready');
    }
    initialize() {
    }
    initAllRooms() {
    }
}
exports.WebSocketComponent = WebSocketComponent;

//# sourceMappingURL=websocket.component.js.map
