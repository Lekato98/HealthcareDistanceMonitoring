import {Socket} from 'socket.io';
import ConversationService from "../models/conversation/ConversationService";

const io = require('socket.io');

enum Event {
    CONNECTION = 'connection',
    RECONNECT = 'reconnection',
    DISCONNECT = 'disconnect',
    NOTIFICATION = 'notification',
    MESSAGE = 'message',
    RECEIVE_MESSAGE = 'receive_message',
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
        this.sockets[userId]?.emit(Event.NOTIFICATION, message);
    }

    public static messageToUser(userId: string, message: any): void {
        this.sockets[userId]?.emit(Event.RECEIVE_MESSAGE, message);
    }

    public static initializeListeners() {
        this.io.on(Event.CONNECTION, (socket) => {
            if (socket.handshake.query?.userId) {
                const userId = socket.handshake.query.userId;
                this.sockets[userId] = socket;
                socket.on(Event.MESSAGE, (payload: any) => {
                    const message = {
                        title: `Message From ${payload.from.firstName} ${payload.from.lastName}`,
                        body: payload.message,
                        type: 'default',
                        date: new Date(),
                    };

                    const currentMessage = {
                        conversationId: payload.conversationId,
                        from: userId,
                        date: message.date,
                        body: message.body,
                    }

                    this.messageToUser(userId, currentMessage);
                    this.messageToUser(payload.to, currentMessage);
                    ConversationService.addMessage(userId, payload.conversationId, payload.message)
                        .then(() => this.notifyUser(payload.to, message))
                })
            }
        });
    }
}

export default SocketIO;
