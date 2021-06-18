import { nanoid } from 'nanoid';
import { Mentor } from './MentorModel';

class MentorModelUtils {
    public static async preValidate(this: Mentor): Promise<void> {
        this._id = `mentor~${ nanoid() }`;
    }
}

export default MentorModelUtils;
