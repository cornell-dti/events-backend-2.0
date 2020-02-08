import socketIOClient from "socket.io-client";
import SocketIO from "socket.io";

export class Internet {

    private static sockets = new Map<string, SocketIOClient.Socket>();

    static initSocket(endpoint: string) : SocketIOClient.Socket {
        if(!Internet.sockets.has(endpoint)){
            let socket: SocketIOClient.Socket = socketIOClient(endpoint);
            Internet.sockets.set(endpoint, socket);
            return socket;
        } else {
            return Internet.sockets.get(endpoint) as SocketIOClient.Socket;
        }
    }

    static requestRerun(endpoint: string, cInd: number, tInd: number){
        let socket = Internet.sockets.get(endpoint);
        if(!socket){
            console.log('Socket not initialized for endpoint: ' + endpoint);
            return;
        }
        socket.emit('requestRerun', cInd + ";;" + tInd);
    }

    static requestFullRerun(endpoint: string) {
        let socket = Internet.sockets.get(endpoint);
        if(!socket){
            console.log('Socket not initialized for endpoint: ' + endpoint);
            return;
        }
        socket.emit('requestFullRerun');
    }

}