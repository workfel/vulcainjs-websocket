"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("vulcain-corejs/dist");
//
const websocket_component_1 = require("./websocket.component");
const SocketIo = require('socket.io');
let WebSocketService = class WebSocketService {
    /**
     *
     * @param io the io server
     * @param pathWs the path to scan folder with all socket io services
     */
    // constructor(private container: IContainer, server: AbstractAdapter, private pathWs: string = 'ws') {
    //     this.io = new SocketIo(server);
    // }
    start(container, server, services, pathWs = 'ws') {
        this.container = container;
        this.io = new SocketIo(server);
        this.services = services;
        // this.container.injectFrom(pathWs);
        this.initializeListener();
    }
    initializeListener() {
        let ws = new websocket_component_1.WebSocketComponent(this.container, this.io, this.services);
        this.io.on('connection', (socket) => {
            // console.log('User connected');
            ws.newSocketHappen(socket);
        });
    }
};
WebSocketService = __decorate([
    dist_1.Injectable(dist_1.LifeTime.Singleton, 'WebSocketService')
], WebSocketService);
exports.WebSocketService = WebSocketService;

//# sourceMappingURL=websocket.service.js.map
