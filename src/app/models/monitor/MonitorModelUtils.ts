import { nanoid } from 'nanoid';
import { HealthcareMonitor } from './MonitorModel';

class MonitorModelUtils {
    public static async preValidate(this: HealthcareMonitor): Promise<void> {
        this.monitorId = `monitor~${nanoid()}`;
    }
}

export default MonitorModelUtils;
