import { Doctor } from './DoctorModel';
import { nanoid } from 'nanoid';

class DoctorModelUtils {
    public static async preValidate(this: Doctor): Promise<void> {
        this._id = `doctor~${ nanoid() }`;
    }
}

export default DoctorModelUtils;
