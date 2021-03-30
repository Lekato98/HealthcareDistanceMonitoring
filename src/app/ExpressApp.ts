import express, { Express } from 'express';
import HomeRoute from './routes/HomeRoute';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongooseService from './services/MongooseService';

abstract class ExpressApp {
    public static app: Express;
    public static readonly PORT = process.env.PORT || 3333;
    public static readonly PUBLIC_FILE_PATH = path.join(__dirname, 'public');
    public static readonly MIDDLEWARES = [
        cors(),
        express.json(),
        bodyParser.json(),
        bodyParser.urlencoded({extended: true}),
        express.static(__dirname),
    ];

    public static createServer(): void {
        this.app = express();
        this.app.listen(this.PORT, () => console.log(`Server listening to ${ this.PORT }`));
        this.initializeMiddlewares();
        this.initializeRoutes();

        MongooseService.connect()
            .then(() => console.log('~Mongoose Connected'));
    }

    public static initializeMiddlewares(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'public/views'));
        this.app.use(this.MIDDLEWARES);
    }

    public static initializeRoutes(): void {
        this.app.use(HomeRoute.HOME_PREFIX_URL, HomeRoute.ROUTE); // default route
    }
}

export default ExpressApp;
