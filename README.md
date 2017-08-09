# vulcainjs-websocket

This plugin add WebSocket integration to vulcainjs framework (via Socket.io). 

<p/>
<img src="https://nodei.co/npm/vulcainjs-websocket.png?downloads=true&stars=true" alt=""/>

<p/>

[![dependencies](https://img.shields.io/david/workfel/vulcainjs-websocket.svg)](https://www.npmjs.com/package/vulcainjs-websocket)
[![license](https://img.shields.io/npm/l/vulcainjs-websocket.svg)](https://www.npmjs.com/package/vulcainjs-websocket)

## Installation

```shell
$ npm install vulcainjs-websocket
```

## About
This is a small plugin for the [vulcainjs](http://www.vulcainjs.org/) server framework for seamless WebSocket protocol integration. It accepts WebSocket connections.

## Usage
First of all create your [vulcain project](http://www.vulcainjs.org/gettingStarted/).
When your project are created install the plugin `npm install vulcainjs-websocket`.

## Client
Use `socket.io` client API to connect to this `WebSocket`. 
Once connected, do your `authentication` process (if needed) and wait for the `ready` event.

### Create a socket event
Create a folder  `ws` into `src` directory. All the class in this folder will be inject into your application.

### Explanation
To create a socket event we need to create an `Injectable` class. And implement an `IWs` interface.
The annotation `Injectable` will permit to autoload this class with the **DI**.

```js
@Injectable(LifeTime.Singleton, 'WSChatMessage')
export class WSChatMessage implements IWs { }
```

#### WSChatMessage.ts
Example of implementation for a chat messaging.
```js
import { Injectable, LifeTime } from "vulcain-corejs/dist";
import { IWs } from 'vulcainjs-websocket/dist';

@Injectable(LifeTime.Singleton, 'WSChatMessage')
export class WSChatMessage implements IWs {

    // https://socket.io/docs/server-api/#server
    private io: SocketIO.Server;


    init(io: SocketIO.Server) {
        this.io = io;
    }
    
    onNewSocket(socket: SocketIO.Socket, user?: any) {
        // Do what you need to with your new socket, and associated user (if any)
    } 

    onCall(msg: any): void {
        console.log('WSChatMessage onCall :', msg);
        // Send event for all 
        this.io.emit('new-msg-arrived', msg);
    }
    onSetRoomName(): string {
        throw new Error("Method not implemented.");
    }

    /**
     * This method is for listening event will be called with the return string
     * https://socket.io/docs/server-api/#socket-on-eventname-callback
     */
    onSetEventName(): string {
        return 'chat-message';
    }

}

```

The architecture should be like this.
```
| src
    | api
        | ...
    | ws
        | chat
            | WSChatMessage.ts
```

## Implement all sockets
Now you have created an socket listener event and sender. You need to setup your vulcain project.
On the `startup.ts` file add this following lines into `initializeServices` method.

```js
initializeServices(container: IContainer) {
        // Register custom services from a specific folder
        // this.injectFrom("...");
        container.injectSingleton(WebSocketService); // Inject the WebSocketService
        //ws is the path where you will put all your webSocket.
        this.injectFrom("ws");
    }
```

After that you need to init the socket connection. Update yhe `onServerStarted` method into `startup.ts` file.
```js
 onServerStarted(server, adapter) {

        let wsService = this.container.get<WebSocketService>('WebSocketService');

        //
        let allMyWebSocket = ['WSChatMessage'];
        //let allMyWebSocket = ['WSChatMessage', 'AnotherWS', 'AnotherWS', ...];


        wsService.start(this.container, server, allMyWebSocket);
    }
```

When you create a new WebSocket class you need to put it into the `allMyWebSocket` variable. The string value is the value name of `Injectable` name.
```js
@Injectable(LifeTime.Singleton, 'TheNameOfWebSocketClass')
```

## Securing websocket
Incoming websockets can be authorized using Vulcain's `TokenService`. Clients must be logged into the `vulcain service`  before starting the socket connection. By default, the library will accept unauthorized connections. Incoming connections will have a limited time to send their authorization token using :
```
socket.emit('authorize', {token: thetoken}); // Token must start with "Bearer "
```
If the token is valid, the server will send back an `authorized` event, along with the `user` adecoded by the `TokenService`, and call every `iWS` with the `socket` and its `user`.

### Configuring security
`IDynamicConfigurationProperties` can be set to customize security's behavior:

#### `WEBSOCKET_ACCEPT_UNAUTHORIZED_CONNECTIONS`
Defaults to `true`. 

If set to `false`, the `WebSocketService` will close any unauthorized connection after the specified delay.

If set to `true`, the `WebSocketService` will leave anonymous connections open. The sockets can still authorize within the specify delay.

#### `WEBSOCKET_TIME_TO_AUTHORIZE_CONNECTIONS`
Defaults to `2000`. 

Corresponds to the delay the `WebSocket clients` have to send their `Authorization token`. 

#### `WEBSOCKET_DISABLE_SECURITY`
Defaults to `false`.

Set to `true` if you want to disable security at all.
