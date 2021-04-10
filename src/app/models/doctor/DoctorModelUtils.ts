import { SpecialDoctor } from './DoctorModel';
import { nanoid } from 'nanoid';

class DoctorModelUtils {
    public static async preValidate(this: SpecialDoctor): Promise<void> {
        this.doctorId = `Doctor#${nanoid()}`;
    }
}

export default DoctorModelUtils;
