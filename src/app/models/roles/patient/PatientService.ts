import PatientModel, { IPatient, Patient } from './PatientModel';
import { DocumentType } from '@typegoose/typegoose';
import { Status } from '../IRole';
import { ACTIVE } from '../../../helpers/constants';
import DateUtils from '../../../utils/DateUtils';
import { QueryUpdateOptions } from 'mongoose';
import MentorModel from '../mentor/MentorModel';
import UserModel from '../../user/UserModel';
import UserService from '../../user/UserService';
import DailyReportService from "../../reports/daily/DailyReportService";

class PatientService {
    private static readonly PATIENTS_PAIR_PAGE = 20;

    public static async updateStatus(patientId: string): Promise<any> {
        const reports = await DailyReportService.getReportsByPatientId(patientId);
        console.log(reports);
    }

    public static async getOnWait(): Promise<DocumentType<Patient>[]> {
        const patients = await PatientModel.find({});
        const currentDate = new Date();

        return patients.filter(patient => patient.nextDailyReportDate <= currentDate);
    }

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

    public static async findOneByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOne({userId});
    }

    public static async patchNextReportDate(patientId: string): Promise<any> {
        const nextDailyReportDate = DateUtils.getDayReportTimeAfterNDays(1);
        const options: QueryUpdateOptions = {runValidators: true};

        return PatientModel.updateOne({_id: patientId}, {nextDailyReportDate}, options);
    }

    public static async findOneById(patientId: string): Promise<any> {
        const matchStage = {$match: {_id: patientId}};
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };

        const unwindStage = {$unwind: '$user'};
        const projectStage = {$project: {'user.password': 0}};
        const pipeline = [matchStage, lookupStage, unwindStage, projectStage];

        return (await PatientModel.aggregate(pipeline))[0];
    }

    public static async isExistByUserId(userId: string): Promise<boolean> {
        return PatientModel.exists({userId});
    }

    public static async getPatientsByPageNumber(page: number = 0, mentorId?: string): Promise<any[]> {
        const sortStage = {$sort: {firstName: 1, lastName: 1}};
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
        const patients = await PatientModel.aggregate(pipeline);
        const mentor = mentorId && await MentorModel.findById(mentorId);
        return patients.map(patient => ({...patient, isMine: mentor?.patients.includes(patient._id)}));
    }

    public static async getMonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage = {$sort: {firstName: 1, lastName: 1}};
        const skipStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage = {
            $lookup: {
                from: MentorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'mentor',
            },
        };
        const matchStage = {$match: {mentor: {$exists: true}}};
        const unwindStage = {$unwind: {path: '$mentor', preserveNullAndEmptyArrays: true}};
        const pipeline = [lookupStage, unwindStage, matchStage, sortStage, skipStage, limitStage];

        return PatientModel.aggregate(pipeline);
    }

    public static async getUnmonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage = {$sort: {firstName: 1, lastName: 1}};
        const skipStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage = {
            $lookup: {
                from: MentorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'mentor',
            },
        };
        const matchStage = {$match: {mentor: {$exists: false}}};
        const unwindStage = {$unwind: {path: '$mentor', preserveNullAndEmptyArrays: true}};
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
