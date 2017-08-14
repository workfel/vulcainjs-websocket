"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.services.forEach((service) => __awaiter(this, void 0, void 0, function* () {
            yield service.onNewSocket(socket, user);
            socket.on(service.onSetEventName(), (msg) => {
                service.onCall(msg, socket);
            });
        }));
        socket.emit('ready');
    }
    initialize() {
    }
    initAllRooms() {
    }
}
exports.WebSocketComponent = WebSocketComponent;

//# sourceMappingURL=websocket.component.js.map
