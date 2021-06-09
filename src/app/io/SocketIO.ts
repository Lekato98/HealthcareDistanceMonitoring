import { Socket } from 'socket.io';

const io = require('socket.io');

enum Event {
    CONNECTION = 'connection',
    RECONNECT = 'reconnection',
    DISCONNECT = 'disconnect',
    NOTIFICATION = 'notification',
    NOTIFY = 'notify'
}

class SocketIO {
    public static io: Socket;

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
        this.io.to(userId).emit(Event.NOTIFY, message);
    }

    public static initializeListeners() {
        this.io.on(Event.CONNECTION, (socket) => {
            /*setInterval(() => {
                socket.emit(Event.NOTIFICATION, 'New Notification');
            }, 5000);*/

            socket.on(Event.RECONNECT, () => {
                // console.log(Event.RECONNECT);
            });

            socket.on(Event.DISCONNECT, () => {
                // console.log(Event.DISCONNECT);
            });
        });
    }
}

export default SocketIO;
