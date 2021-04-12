import { DailyReport } from './DailyReportModel';
import { nanoid } from 'nanoid';

class DailyReportUtils {
    public static preValidate(this: DailyReport) {
        this.dailyId = `daily~${ nanoid() }`;
    }
}

export default DailyReportUtils;
