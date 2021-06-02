import PatientModel, { IPatient, Patient } from './PatientModel';
import { DocumentType } from '@typegoose/typegoose';
import { Status } from '../IRole';
import { ACTIVE } from '../../../helpers/constants';
import DateUtils from '../../../utils/DateUtils';
import { QueryUpdateOptions } from 'mongoose';
import MonitorModel from '../monitor/MonitorModel';
import UserModel from '../../user/UserModel';

class PatientService {
    private static readonly PATIENTS_PAIR_PAGE = 20;

    public static async getPatientByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOne({userId});
    }

    public static async create(payload: IPatient): Promise<DocumentType<Patient>> {
        const patient = new Patient(payload);
        patient.active = ACTIVE;
        patient.status = Status.ACCEPTED;
        return PatientModel.create(patient);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOneAndDelete({userId});
    }

    public static async findPatientByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOne({userId});
    }

    public static async patchNextReportDate(userId: string): Promise<any> {
        const nextDailyReportDate = DateUtils.getDayReportTimeAfterNDays(1);
        const options: QueryUpdateOptions = {runValidators: true};

        return PatientModel.updateOne({userId}, {nextDailyReportDate}, options);
    }

    public static async isExistByUserId(userId: string): Promise<boolean> {
        return PatientModel.exists({userId});
    }

    public static async getPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage = {$sort: {createdAt: 1}};
        const skipStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwindStage = {$unwind: '$user'};
        const projectionStage = {
            $project: {
                'user.password': 0,
                'user.__v': 0,
                'user.createdAt': 0,
                'user.updatedAt': 0,
            },
        };

        const pipeline = [sortStage, skipStage, limitStage, lookupStage, unwindStage, projectionStage];
        return PatientModel.aggregate(pipeline);
    }

    public static async getMonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage = {$sort: {createdAt: 1}};
        const skipStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage = {
            $lookup: {
                from: MonitorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'monitor',
            },
        };
        const matchStage = {$match: {monitor: {$exists: true}}};
        const unwindStage = {$unwind: {path: '$monitor', preserveNullAndEmptyArrays: true}};
        const pipeline = [lookupStage, unwindStage, matchStage, sortStage, skipStage, limitStage];

        return PatientModel.aggregate(pipeline);
    }

    public static async getUnmonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage = {$sort: {createdAt: 1}};
        const skipStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage = {
            $lookup: {
                from: MonitorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'monitor',
            },
        };
        const matchStage = {$match: {monitor: {$exists: false}}};
        const unwindStage = {$unwind: {path: '$monitor', preserveNullAndEmptyArrays: true}};
        const pipeline = [lookupStage, unwindStage, matchStage, sortStage, skipStage, limitStage];

        return PatientModel.aggregate(pipeline);
    }

    public static async searchPatients(text: string): Promise<any[]> {
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwindStage = {$unwind: '$user'};
        const matchStage = {$match: {'user.nationalId': {$regex: `.*${ text }.*`}}};
        const projectionStage = {
            $project: {
                'user.password': 0,
                'user.__v': 0,
                'user.createdAt': 0,
                'user.updatedAt': 0,
            },
        };

        const pipeline = [lookupStage, unwindStage, matchStage, projectionStage];

        return PatientModel.aggregate(pipeline);
    }
}

export default PatientService;
