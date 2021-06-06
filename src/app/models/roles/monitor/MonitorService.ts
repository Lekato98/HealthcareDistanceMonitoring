import { DocumentType } from '@typegoose/typegoose';
import MonitorModel, { IMonitor, Monitor } from './MonitorModel';
import { Status } from '../IRole';
import { INACTIVE } from '../../../helpers/constants';
import PatientModel, { IPatient, Patient } from '../patient/PatientModel';
import PatientService from '../patient/PatientService';

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

    public static async findOneByUserId(userId: string): Promise<DocumentType<Monitor>> {
        return MonitorModel.findOne({userId});
    }

    public static async isExistByUserId(userId: string): Promise<boolean> {
        return MonitorModel.exists({userId});
    }

    public static async addPatient(monitorId: string, patientId: string): Promise<any> {
        const isPatientExist = await PatientModel.exists({_id: patientId});

        if (isPatientExist) {
            const monitor = await MonitorModel.findById(monitorId);
            const canAddPatient = monitor?.patients.length < this.PATIENTS_LIMIT;
            if (monitor?.active && canAddPatient) {
                return MonitorModel.updateOne({_id: monitorId}, {$addToSet: {patients: patientId}});
            } else {
                throw Error((monitor ? 'Full space!' : 'Forbidden you are not monitor!'));
            }
        } else {
            throw Error('Unknown patient!');
        }
    }

    public static async removePatient(monitorId: string, patientId: string): Promise<any> {
        return MonitorModel.updateOne({_id: monitorId}, {$pull: {patients: patientId}});
    }

    public static async getMyPatients(monitorId: string): Promise<any> {
        const monitor = await MonitorModel.findById(monitorId);
        const patients = monitor?.patients;
        return Promise.all(patients.map((patientId: any) => PatientService.findOneById(patientId)));
    }
}

export default MonitorService;
