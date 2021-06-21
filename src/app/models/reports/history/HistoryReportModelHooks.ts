import { nanoid } from 'nanoid';
import { HistoryReport } from './HistoryReportModel';

class HistoryReportModelHooks {
    public static preValidate(this: HistoryReport) {
        if (!this._id) {
            this._id = `history~${ nanoid() }`;
        }
    }
}

export default HistoryReportModelHooks;
