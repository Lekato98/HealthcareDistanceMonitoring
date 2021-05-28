import { DocumentType } from '@typegoose/typegoose';
import MonitorModel, { IMonitor, Monitor } from './MonitorModel';
import { Status } from '../IRole';
import { INACTIVE } from '../../../helpers/constants';

class MonitorService {
    public static async create(payload: IMonitor): Promise<DocumentType<Monitor>> {
        const monitor = new Monitor(payload);
        monitor.active = INACTIVE;
        monitor.status = Status.PENDING;
        return MonitorModel.create(monitor);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Monitor>> {
        return MonitorModel.findOneAndDelete({userId});
    }
}

export default MonitorService;
