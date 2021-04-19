import { DocumentType } from '@typegoose/typegoose';
import MonitorModel, { IMonitor, Monitor } from './MonitorModel';

class MonitorService {
    public static async create(payload: IMonitor): Promise<DocumentType<Monitor>> {
        const monitor = new Monitor(payload);
        return MonitorModel.create(monitor);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Monitor>> {
        return MonitorModel.findOneAndDelete({userId});
    }
}

export default MonitorService;
