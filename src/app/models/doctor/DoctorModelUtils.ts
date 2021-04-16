import { SpecialDoctor } from './DoctorModel';
import { nanoid } from 'nanoid';

class DoctorModelUtils {
    public static async preValidate(this: SpecialDoctor): Promise<void> {
        this._id = `doctor~${ nanoid() }`;
    }
}

export default DoctorModelUtils;
