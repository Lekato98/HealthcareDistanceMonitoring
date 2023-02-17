import {config} from '../../config/config';
import {mongoose} from "@typegoose/typegoose";

abstract class MongooseService {
    public static db: typeof mongoose;
    public static readonly MONGODB_URI: string = config.MONGODB_URI;

    public static async connect(): Promise<void> {
        const connectionOptions: mongoose.ConnectOptions = {
            autoIndex: true,
            autoCreate: true
        };

        try {
            console.log('~Connecting to MongoDB');
            mongoose.set('strictQuery', true);
            MongooseService.db = await mongoose.connect(this.MONGODB_URI, connectionOptions);
            console.log('~Connected Successfully MongoDB');
        } catch (err: any) {
            console.error(err.message);
            process.exit(0);
        }
    }
}

export default MongooseService;
