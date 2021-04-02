import express, { Express } from 'express';
import HomeRoute from './routes/HomeRoute';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongooseService from './services/MongooseService';
import APIRoute from './routes/apis/APIRoute';

abstract class ExpressApp {
    public static app: Express;
    public static readonly PORT: number = Number(process.env.PORT || 3333);
    public static readonly PUBLIC_FILE_PATH: string = path.join(__dirname, 'public');
    public static readonly VIEWS_PATH: string = path.join(__dirname, 'public/views');
    public static readonly MIDDLEWARES = [
        cors(),
        express.json(),
        bodyParser.json(),
        bodyParser.urlencoded({extended: true}),
        express.static(ExpressApp.PUBLIC_FILE_PATH),
    ];

    public static createServer(): void {
        this.app = express();
        this.app.listen(this.PORT, () => console.log(`Server listening to ${ this.PORT }`));

        this.initializeViewEngine();
        this.initializeMiddlewares();
        this.initializeRoutes();

        // connect to mongoDB
        MongooseService.connect()
            .then(() => console.log('~Mongoose Connected'));
    }

    public static initializeViewEngine(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', this.VIEWS_PATH);
    }

    public static initializeMiddlewares(): void {
        this.app.use(this.MIDDLEWARES);
    }

    public static initializeRoutes(): void {
        this.app.use(HomeRoute.ROUTE_PREFIX_URL, HomeRoute.ROUTE); // / @default route
        this.app.use(APIRoute.ROUTE_PREFIX_URL, APIRoute.ROUTE); // /api @api route
    }
}

export default ExpressApp;
