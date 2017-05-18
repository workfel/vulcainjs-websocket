"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketComponent {
    constructor(container, io, services) {
        this.container = container;
        this.io = io;
        this.services = services;
        this.initialize();
    }
    newSocketHappen(socket) {
        this.services.forEach((serviceName) => {
            let service = this.container.get(serviceName);
            service.init(this.io, socket);
            // let instance = new WsAdapter(this.io, socket);
            socket.on(service.onSetEventName(), (msg) => {
                service.onCall(msg);
            });
        });
    }
    initialize() {
    }
    initAllRooms() {
    }
}
exports.WebSocketComponent = WebSocketComponent;

//# sourceMappingURL=websocket.component.js.map
