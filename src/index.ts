import ExpressApp from './app/ExpressApp';
import SocketIO from './app/io/SocketIO';
import * as http from 'http';
import { config } from './config/config';

const PORT = config.PORT;
const expressApp = new ExpressApp();
const server = http.createServer(expressApp.getApp());
const socketIO = new SocketIO(server);

server.listen(PORT, () => console.log(`Server listening to ${ PORT }`));
