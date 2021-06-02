import { DocumentType } from '@typegoose/typegoose';
import MonitorModel, { IMonitor, Monitor } from './MonitorModel';
import { Status } from '../IRole';
import { INACTIVE } from '../../../helpers/constants';
import PatientModel from '../patient/PatientModel';

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

    public static async findMonitorByUserId(userId: string): Promise<DocumentType<Monitor>> {
        return MonitorModel.findOne({userId});
    }

    public static async isExistByUserId(userId: string): Promise<boolean> {
        return MonitorModel.exists({userId});
    }

    public static async addPatient(monitorId: string, patientId: string): Promise<any> {
        const isPatient = await PatientModel.exists({_id: patientId});
        if (isPatient) {
            return MonitorModel.updateOne({_id: monitorId}, {$push: {patients: patientId}});
        } else {
            throw Error('Unknown patient!');
        }
    }
}

export default MonitorService;
