import { DocumentType } from '@typegoose/typegoose';
import MonitorModel, { IMonitor, Monitor } from './MonitorModel';
import { Status } from '../IRole';
import { INACTIVE } from '../../../helpers/constants';
import PatientModel from '../patient/PatientModel';

class MonitorService {
    public static readonly PATIENTS_LIMIT = 5;

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

    public static async canAddPatient(monitorId: string): Promise<boolean> {
        const monitor = await MonitorModel.findById(monitorId);
        const patients = monitor?.patients;
        return patients?.length < this.PATIENTS_LIMIT;
    }

    public static async addPatient(monitorId: string, patientId: string): Promise<any> {
        const isPatientExist = await PatientModel.exists({_id: patientId});

        if (isPatientExist) {
            const canAddPatient = await this.canAddPatient(monitorId);
            if (canAddPatient) {
                return MonitorModel.updateOne({_id: monitorId}, {$addToSet: {patients: patientId}});
            } else {
                throw Error('Full space!');
            }

        } else {
            throw Error('Unknown patient!');
        }
    }

    public static async removePatient(monitorId: string, patientId: string): Promise<any> {
        return MonitorModel.updateOne({_id: monitorId}, {$pull: {patients: patientId}});
    }
}

export default MonitorService;
