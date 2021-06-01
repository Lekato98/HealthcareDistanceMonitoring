import { Emergency } from './EmergencyModel';
import { nanoid } from 'nanoid';

class EmergencyModelHooks {
    public static preValidate(this: Emergency) {
        if (!this._id) {
            this._id = `emergency~${ nanoid() }`;
        }
    }
}

export default EmergencyModelHooks;
