import {Socket} from 'socket.io';
import ConversationService from "../models/conversation/ConversationService";
import RoleService from "../models/roles/RoleService";
import {RoleName} from "../models/user/UserModel";
import IRole from "../models/roles/IRole";
import UserService from "../models/user/UserService";

const io = require('socket.io');

export interface INotificationMessage {
    title: string;
    body: string;
    type: string;
    date: Date;
    redirectUrl?: string;
}

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
            next();
        });
    }

    public static notifyUser(userId: string, message: INotificationMessage): void {
        this.sockets[userId]?.emit(Event.NOTIFICATION, message);
    }

    public static messageToUser(userId: string, message: any): void {
        this.sockets[userId]?.emit(Event.RECEIVE_MESSAGE, message);
    }

    public static emitDoctorAndMentors(message: INotificationMessage): void {
        const doctorsResponse = RoleService.getActiveByRoleName(RoleName.DOCTOR);
        const mentorsResponse = RoleService.getActiveByRoleName(RoleName.MENTOR);

        doctorsResponse
            .then((doctors) =>
                doctors.forEach((doctor: any) => {
                    UserService.addNotification(doctor.userId._id, message)
                        .then(() => SocketIO.notifyUser(doctor.userId._id, message));
                })
            );

        mentorsResponse
            .then((mentors) =>
                mentors.forEach((mentor: any) =>
                    UserService.addNotification(mentor.userId._id, message)
                        .then(() => SocketIO.notifyUser(mentor.userId._id, message)))
            );
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
                        redirectUrl: `/conversations/${payload.conversationId}`
                    };

                    const currentMessage = {
                        conversationId: payload.conversationId,
                        from: userId,
                        date: message.date,
                        body: message.body,
                    };

                    this.messageToUser(userId, currentMessage);
                    this.messageToUser(payload.to, currentMessage);
                    ConversationService.addMessage(userId, payload.conversationId, payload.message)
                        .then(() => this.notifyUser(payload.to, message));
                })
            }
        });
    }
}

export default SocketIO;
