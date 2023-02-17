import express, { Express } from 'express';
import HomeRoute from './routes/HomeRoute';
import path from 'path';
import cors from 'cors';
import ApiRoute from './routes/apis/v1/ApiRoute';
import AuthRoute from './routes/AuthRoute';
import AuthMiddleware from './middlewares/AuthMiddleware';
import { Inject } from 'dependency-injection-v1';
import UserRoute from './routes/UserRoute';
import { config } from '../config/config';
import DateUtils from './utils/DateUtils';
import PatientService from './models/roles/patient/PatientService';
import SocketIO from './io/SocketIO';
import UserService from './models/user/UserService';

const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

class ExpressApp {
    public readonly PORT: string = config.PORT;
    public readonly PUBLIC_FILE_PATH: string = path.join(__dirname, 'public'); // public folder
    public readonly VIEWS_PATH: string = path.join(__dirname, 'public/views'); // views folder
    public readonly _12H: number = 43200000;
    public readonly urlencodedOptions = {extended: true};
    // limit each IP to 1 request per 2 seconds
    public readonly requestLimiter = rateLimit({
        windowMs: 60 * 1000,
        max: 30,
    });
    public readonly MIDDLEWARES = [
        cors(),
        express.json(),
        express.urlencoded(this.urlencodedOptions),
        express.static(this.PUBLIC_FILE_PATH),
        cookieParser(),
        compression(),
    ];

    private readonly app: Express = express();
    private reminderInterval: NodeJS.Timeout;

    @Inject(AuthMiddleware) private authMiddleware: AuthMiddleware;

    constructor() {
        this.initializeViewEngine();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeReminders();
        this.app.set('trust proxy', 1);
    }

    public initializeViewEngine(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', this.VIEWS_PATH);
    }

    public initializeMiddlewares(): void {
        // @TOP PRIORITY to avoid DDOS attack and spammer
        // this.app.use(this.requestLimiter);
        // called before any request
        this.app.use(this.MIDDLEWARES);
        // initialize locals for sharing some data between middlewares and controller
        this.app.use(this.authMiddleware.setRequestAppLocals);
        // should be called before any request
        this.app.use(this.authMiddleware.setAuth);
    }

    public initializeRoutes(): void {
        this.app.use(ApiRoute.ROUTE_PREFIX_URL, ApiRoute.ROUTE); // /api/v1 @api version 1
        this.app.use(AuthRoute.ROUTE_PREFIX_URL, AuthRoute.ROUTE); // /auth @auth
        this.app.use(UserRoute.ROUTE_PREFIX_URL, UserRoute.ROUTE);
        this.app.use(HomeRoute.ROUTE_PREFIX_URL, HomeRoute.ROUTE); // / @default
    }

    public initializeReminders(): void {
        this.reminderInterval = setInterval(async () => {
            const payload = {
                title: 'Reminder',
                body: 'don\'t miss your report!',
                isRead: false,
                time: new Date(),
            };

            const patients = await PatientService.getOnWait();
            await Promise.all(patients.map(patient => UserService.addNotification(patient.userId, payload)));
            patients.forEach(patient => SocketIO.notifyUser(patient.userId, {...payload, type: 'warning'}));
        }, this.getTimeoutReminder());
    }

    public getTimeoutReminder(): number {
        const now = new Date(Date.now());
        const next8 = DateUtils.getDayReportTimeAfterNDays(0);

        return Math.abs(next8.getTime() - now.getTime());
    }

    public getApp(): Express {
        return this.app;
    }
}

export default ExpressApp;
