"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vulcain_corejs_1 = require("vulcain-corejs");
const dist_1 = require("vulcain-corejs/dist");
//
const websocket_component_1 = require("./websocket.component");
const rxjs_1 = require("rxjs");
const SocketIo = require('socket.io');
let WebSocketService = class WebSocketService {
    constructor() {
        this.services = [];
        this.authorizedSockets = {};
    }
    /**
     *
     * @param container
     * @param server The instance of express Server to attach socket.io on it
     * @param services This is a list of websocket service who will be listened
     */
    start(container, server, services) {
        this.container = container;
        this.io = new SocketIo(server);
        this.tokenService = this.container.get('TokenService');
        this.acceptUnauthorizedConnections = vulcain_corejs_1.System.createServiceConfigurationProperty("WEBSOCKET_ACCEPT_UNAUTHORIZED_CONNECTIONS", "true");
        this.timeToAuthorizeConnectionInMs = vulcain_corejs_1.System.createServiceConfigurationProperty("WEBSOCKET_TIME_TO_AUTHORIZE_CONNECTIONS", 1);
        this.securityDisabled = vulcain_corejs_1.System.createServiceConfigurationProperty("WEBSOCKET_DISABLE_SECURITY", "false");
        // this.container.injectFrom(pathWs);
        this.initializeServices(services);
        this.ws = new websocket_component_1.WebSocketComponent(this.container, this.io, this.services);
        this.initializeListener();
    }
    initializeListener() {
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            if (this.securityDisabled.value === "true") {
                this.ws.newSocketHappen(socket);
            }
            else {
                this.startSocketAuthentication(socket);
            }
        }));
    }
    checkAndInitializeSocket(socket) {
        socket.emit('time_to_authorize_expired');
        if (this.authorizedSockets[socket.id]) {
            // Do nothing, socket is open already
        }
        else if (this.acceptUnauthorizedConnections.value === "true") {
            socket.emit("authorized", { user: 'anonymous' });
            this.ws.newSocketHappen(socket);
        }
        else {
            socket.disconnect(true);
        }
        // whatever happens, remove socket id from list, we don't need to keep it for long
        this.authorizedSockets[socket.id] = null;
    }
    initializeServices(services) {
        services.forEach((serviceName) => {
            let service = this.container.get(serviceName);
            service.init(this.io);
            this.services.push(service);
        });
    }
    getUserToken(socket, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // get tokenservice or return null
            if (!this.tokenService) {
                return;
            }
            try {
                // resolve token or return null
                let user = yield this.tokenService.verifyTokenAsync({ token: token, tenant: "" });
                this.authorizedSockets[socket.id] = user;
                this.ws.newSocketHappen(socket, this.authorizedSockets[socket.id]);
                socket.emit("authorized", user);
            }
            catch (error) {
                socket.emit('invalid_token');
                return;
            }
        });
    }
    startSocketAuthentication(socket) {
        // 1) Instantiate a listener for token
        socket.on('authorize', (message) => __awaiter(this, void 0, void 0, function* () {
            if (message.token && message.token.startsWith("Bearer ")) {
                yield this.getUserToken(socket, message.token.split(" ")[1]); // Removing the "Bearer " part
            }
            else {
                socket.emit('invalid_token');
            }
        }));
        // 2) start timer
        rxjs_1.Observable.timer(this.timeToAuthorizeConnectionInMs.value).subscribe(() => {
            this.checkAndInitializeSocket(socket);
        });
        // 3) and tell socket
        socket.emit(`authorize`, { timeToAuthorize: this.timeToAuthorizeConnectionInMs.value });
        if ((this.acceptUnauthorizedConnections.value === "false")) {
            socket.emit(`unauthorized_connections`, { accepted: false });
        }
        else {
            socket.emit(`unauthorized_connections`, { accepted: true });
        }
    }
};
WebSocketService = __decorate([
    dist_1.Injectable(dist_1.LifeTime.Singleton, 'WebSocketService')
], WebSocketService);
exports.WebSocketService = WebSocketService;

//# sourceMappingURL=websocket.service.js.map
