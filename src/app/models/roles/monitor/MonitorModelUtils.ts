import { nanoid } from 'nanoid';
import { Monitor } from './MonitorModel';

class MonitorModelUtils {
    public static async preValidate(this: Monitor): Promise<void> {
        this._id = `monitor~${ nanoid() }`;
    }
}

export default MonitorModelUtils;
