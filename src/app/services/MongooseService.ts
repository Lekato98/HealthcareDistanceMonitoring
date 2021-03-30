import mongoose from 'mongoose';

abstract class MongooseService {
    public static db: typeof mongoose;
    public static readonly MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost/test';
    public static async connect(): Promise<void> {
        const connectionOption = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        };

        try {
            this.db = await mongoose.connect(this.MONGODB_URI, connectionOption);
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}

export default MongooseService;
