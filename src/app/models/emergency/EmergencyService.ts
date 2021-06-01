import EmergencyModel, { Emergency, IEmergency } from './EmergencyModel';
import { DocumentType } from '@typegoose/typegoose';

class EmergencyService {
    public static async create(payload: IEmergency): Promise<DocumentType<Emergency>> {
        const emergency = new Emergency(payload);
        return EmergencyModel.create(emergency);
    }

    public static async getAll(): Promise<DocumentType<Emergency>[]> {
        return EmergencyModel.find({});
    }

    public static async delete(emergencyId: string): Promise<DocumentType<Emergency>> {
        return EmergencyModel.findByIdAndDelete(emergencyId);
    }
}

export default EmergencyService;
