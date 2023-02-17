import ExpressApp from './app/ExpressApp';
import SocketIO from './app/io/SocketIO';
import * as http from 'http';
import {config} from './config/config';
import MongooseService from "./app/services/MongooseService";
import CloudinaryService from "./app/services/CloudinaryService";

void (async function bootstrap() {
    console.log('Bootstrapping...');
    // connect to mongoDB
    await MongooseService.connect();
    console.log('~Mongoose Connected');

    // connect to Cloudinary
    CloudinaryService.connect();
    const PORT = config.PORT;
    const expressApp = new ExpressApp();
    const server = http.createServer(expressApp.getApp());

    SocketIO.initialize(server);
    server.listen(PORT, () => console.log(`Server listening to ${PORT}`));
})()
