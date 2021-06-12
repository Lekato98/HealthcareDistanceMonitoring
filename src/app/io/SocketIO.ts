import {Socket} from 'socket.io';
import ConversationService from "../models/conversation/ConversationService";

const io = require('socket.io');

enum Event {
    CONNECTION = 'connection',
    RECONNECT = 'reconnection',
    DISCONNECT = 'disconnect',
    NOTIFICATION = 'notification',
    MESSAGE = 'message',
}

class SocketIO {
    public static io: Socket;
    public static sockets: any = {};

    public static initialize(server: any) {
        this.io = io(server);
        this.initializeListeners();
        this.initializeMiddlewares();
    }

    public static initializeMiddlewares() {
        this.io.use((event, next) => {
            // console.log('socket middleware');
            next();
        });
    }

    public static notifyUser(userId: string, message: any): void {
        this.sockets[userId].emit(Event.NOTIFICATION, message);
    }

    public static initializeListeners() {
        this.io.on(Event.CONNECTION, (socket) => {
            if (socket.handshake.query?.userId) {
                this.sockets[socket.handshake.query.userId] = socket;
                socket.on(Event.MESSAGE, (payload: any) => {
                    const message = {
                        title: 'Message',
                        body: payload.message,
                        type: 'default',
                        date: new Date(),
                    };
                    ConversationService.addMessage(payload.conversationId, payload.message)
                        .then(() => this.notifyUser(payload.to, message))
                })
            }
        });
    }
}

export default SocketIO;
