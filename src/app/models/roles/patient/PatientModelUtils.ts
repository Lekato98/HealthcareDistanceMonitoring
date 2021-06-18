import {nanoid} from 'nanoid';
import {Patient} from './PatientModel';
import {IDailyReport} from "../../reports/daily/DailyReportModel";

export enum StatusRange {
    NEEDS_HOSPITALIZATION_X = 0,
    NEEDS_HOSPITALIZATION_Y = 1,
    BAD_X = 1,
    BAD_Y = 2,
    GOOD_X = 2,
    GOOD_Y = 3,
    VERY_GOOD_X = 3,
    VERY_GOOD_Y = 4,
    EXCELLENT_X = 4,
    EXCELLENT_Y = 5.1,
}

export enum HealthStatus {
    NO_STATUS = 'No Status',
    NEEDS_HOSPITALIZATION = 'Needs Hospitalization',
    BAD = 'Bad',
    GOOD = 'Good',
    VERY_GOOD = 'Very Good',
    EXCELLENT = 'Excellent'
}

class PatientModelUtils {
    public static async preValidation(this: Patient): Promise<void> {
        this._id = `patient~${nanoid()}`;
    }

    public static healthStatusToString(healthStatus: number): string {
        if (PatientModelUtils.isBetween(StatusRange.NEEDS_HOSPITALIZATION_X, StatusRange.NEEDS_HOSPITALIZATION_Y, healthStatus)) {
            return HealthStatus.NEEDS_HOSPITALIZATION;
        } else if (PatientModelUtils.isBetween(StatusRange.BAD_X, StatusRange.BAD_Y, healthStatus)) {
            return HealthStatus.BAD;
        } else if (PatientModelUtils.isBetween(StatusRange.GOOD_X, StatusRange.GOOD_Y, healthStatus)) {
            return HealthStatus.GOOD;
        } else if (PatientModelUtils.isBetween(StatusRange.VERY_GOOD_X, StatusRange.VERY_GOOD_Y, healthStatus)) {
            return HealthStatus.VERY_GOOD;
        } else if (PatientModelUtils.isBetween(StatusRange.EXCELLENT_X, StatusRange.EXCELLENT_Y, healthStatus)) {
            return HealthStatus.EXCELLENT;
        } else {
            throw new Error('Invalid health status out of range');
        }
    }

    public static isBetween(x: number, y: number, z: number): boolean {
        return z >= x && z < y;
    }
}

export default PatientModelUtils;
