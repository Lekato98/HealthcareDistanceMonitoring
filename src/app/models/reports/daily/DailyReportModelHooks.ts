import { DailyReport } from './DailyReportModel';
import { nanoid } from 'nanoid';

class DailyReportModelHooks {
    public static preValidate(this: DailyReport) {
        if (!this._id) {
            this._id = `daily~${ nanoid() }`;
        }
    }
}

export default DailyReportModelHooks;
