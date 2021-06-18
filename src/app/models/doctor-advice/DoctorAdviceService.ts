import DoctorAdviceModel, {DoctorAdvice, IDoctorAdvice} from "./DoctorAdviceModel";
import {DocumentType} from "@typegoose/typegoose";
import UserModel from "../user/UserModel";
import SocketIO, {INotificationMessage} from "../../io/SocketIO";

class DoctorAdviceService {
    public static async createAdvice(payload: IDoctorAdvice): Promise<DocumentType<DoctorAdvice>> {
        const doctorAdvice = new DoctorAdvice(payload);
        const message: INotificationMessage = {
            title: 'New Doctor Advice',
            body: doctorAdvice.text.substr(0, 15) + '...',
            type: 'default',
            date: new Date(),
        };

        const advice = await DoctorAdviceModel.create(doctorAdvice);
        SocketIO.notifyAll(message);
        return advice;
    }

    public static async getAll(): Promise<any> {
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            }
        };
        const unwindStage = {$unwind: '$user'};
        const sortStage = {$sort: {createdAt: 1}};
        const pipeline = [lookupStage, unwindStage, sortStage];
        return DoctorAdviceModel.aggregate(pipeline);
    }
}

export default DoctorAdviceService;