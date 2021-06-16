import {nanoid} from 'nanoid';
import {Patient} from './PatientModel';
import {IDailyReport} from "../../reports/daily/DailyReportModel";

/*
excellent: Your health status is excellent, you don't need to worry about anything.4-5
Very good:  Your health status is very good, you should feel good about it.3-4
Good: Your health status is good, but keep an eye for suspicious symptoms. 2-3
Bad: Your health status is good, you should meet a doctor. 1-2
Immediate Care: you need immediate care, you should rush to meet your doctor! 0-1
*/
export enum StatusRange {
    IMMEDIATE_CARE_X = 0,
    IMMEDIATE_CARE_Y = 1,
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
    IMMEDIATE_CARE = 'Immediate Care',
    BAD = 'Bad',
    GOOD = 'Good',
    VERY_GOOD = 'Very Good',
    EXCELLENT = 'Excellent'
}

class PatientModelUtils {
    public static async preValidation(this: Patient): Promise<void> {
        this._id = `patient~${nanoid()}`;
    }

    public static transform(report: IDailyReport): any {
        return {

        }
    }

    public static healthStatusToString(healthStatus: number): string {
        if (PatientModelUtils.isBetween(StatusRange.IMMEDIATE_CARE_X, StatusRange.IMMEDIATE_CARE_Y, healthStatus)) {
            return HealthStatus.IMMEDIATE_CARE;
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
