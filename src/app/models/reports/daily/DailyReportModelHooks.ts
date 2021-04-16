import { DailyReport } from './DailyReportModel';
import { nanoid } from 'nanoid';

class DailyReportModelHooks {
    public static preValidate(this: DailyReport) {
        this._id = `daily~${ nanoid() }`;
    }
}

export default DailyReportModelHooks;
