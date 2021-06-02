import EmergencyModel, { Emergency, IEmergency } from './EmergencyModel';
import { DocumentType } from '@typegoose/typegoose';
import PatientModel from '../roles/patient/PatientModel';
import UserModel from '../user/UserModel';

class EmergencyService {
    public static async create(payload: IEmergency): Promise<DocumentType<Emergency>> {
        const emergency = new Emergency(payload);
        return EmergencyModel.create(emergency);
    }

    public static async getAll(): Promise<DocumentType<any>[]> {
        const patientLookupStage = {
            $lookup: {
                from: PatientModel.collection.name,
                localField: 'patient',
                foreignField: '_id',
                as: 'patient',
            },
        };
        const patientUnwindStage = {$unwind: '$patient'};
        const userLookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'patient.userId',
                foreignField: '_id',
                as: 'patient.user',
            },
        };
        const userUnwindStage = {$unwind: '$patient.user'};
        const projectionStage = {$project: {'patient.user.password': 0}};
        const pipeline = [patientLookupStage, patientUnwindStage, userLookupStage, userUnwindStage, projectionStage];
        return EmergencyModel.aggregate(pipeline);
    }

    public static async delete(emergencyId: string): Promise<DocumentType<Emergency>> {
        return EmergencyModel.findByIdAndDelete(emergencyId);
    }
}

export default EmergencyService;
