import express, { Express } from 'express';
import HomeRoute from './routes/HomeRoute';
import path from 'path';
import cors from 'cors';
import bodyParser, { OptionsUrlencoded } from 'body-parser';
import MongooseService from './services/MongooseService';
import ApiRoute from './routes/apis/v1/ApiRoute';
import AuthRoute from './routes/AuthRoute';
import AuthMiddleware from './middlewares/AuthMiddleware';

const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

abstract class ExpressApp {
    public static app: Express;
    public static readonly PORT: number = Number(process.env.PORT || 3333);
    public static readonly PUBLIC_FILE_PATH: string = path.join(__dirname, 'public'); // public folder
    public static readonly VIEWS_PATH: string = path.join(__dirname, 'public/views'); // views folder
    public static readonly urlencodedOptions: OptionsUrlencoded = {extended: true};
    public static readonly limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    });
    public static readonly MIDDLEWARES = [
        bodyParser.json(),
        bodyParser.urlencoded(ExpressApp.urlencodedOptions),
        cors(),
        cookieParser(),
        express.json(),
        express.static(ExpressApp.PUBLIC_FILE_PATH),
    ];

    public static createServer(): void {
        this.app = express();
        this.app.listen(this.PORT, () => console.log(`Server listening to ${ this.PORT }`));

        this.initializeViewEngine();
        this.initializeMiddlewares();
        this.initializeRoutes();
        // this.app.set('trust proxy', 1);

        // connect to mongoDB
        MongooseService.connect()
            .then(() => console.log('~Mongoose Connected'));
    }

    public static initializeViewEngine(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', this.VIEWS_PATH);
    }

    public static initializeMiddlewares(): void {
        this.app.use(ExpressApp.limiter); // to avoid DDOS attack and spammer
        this.app.use(ExpressApp.MIDDLEWARES); // called before any request
        this.app.use(AuthMiddleware.setAuth); // should be called before any request
    }

    public static initializeRoutes(): void {
        this.app.use(ApiRoute.ROUTE_PREFIX_URL, ApiRoute.ROUTE); // /api/v1 @api version 1
        this.app.use(AuthRoute.ROUTE_PREFIX_URL, AuthRoute.ROUTE); // /auth @auth
        this.app.use(HomeRoute.ROUTE_PREFIX_URL, HomeRoute.ROUTE); // / @default
    }
}

export default ExpressApp;
