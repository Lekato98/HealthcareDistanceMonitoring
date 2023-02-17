import PatientModel, {IPatient, Patient} from './PatientModel';
import {DocumentType, mongoose} from '@typegoose/typegoose';
import {Status} from '../IRole';
import {ACTIVE} from '../../../helpers/constants';
import DateUtils from '../../../utils/DateUtils';
import MentorModel from '../mentor/MentorModel';
import UserModel from '../../user/UserModel';
import DailyReportService from "../../reports/daily/DailyReportService";
import {IDailyReport} from "../../reports/daily/DailyReportModel";
import PatientModelUtils from "./PatientModelUtils";

class PatientService {
    private static readonly PATIENTS_PAIR_PAGE = 20;

    public static async updateStatus(patientId: string): Promise<any> {
        const reports = await DailyReportService.getReportsByPatientId(patientId);
        const healthStatusRate = reports.length && reports.reduce((total: number, report: IDailyReport) => (
            total +
            report.headache +
            report.soreThroat +
            report.smell +
            report.fatigue +
            report.shortnessOfBreath +
            report.taste
        ), 0) / reports.length;

        const healthStatus = PatientModelUtils.healthStatusToString(healthStatusRate);
        await PatientModel.updateOne({_id:patientId}, {healthStatus});

        return reports;
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
        const nextDailyReportDate = DateUtils.getDayReportTimeAfterNDays(0);
        const options: mongoose.QueryOptions = {runValidators: true};

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
        return await PatientModel.exists({userId}) !== null;
    }

    public static async getPatientsByPageNumber(page: number = 0, mentorId?: string): Promise<any[]> {
        const sortStage: mongoose.PipelineStage = {$sort: {firstName: 1, lastName: 1}};
        const skipStage: mongoose.PipelineStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage: mongoose.PipelineStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage: mongoose.PipelineStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwindStage: mongoose.PipelineStage = {$unwind: '$user'};
        const projectionStage: mongoose.PipelineStage = {
            $project: {
                'user.password': 0,
                'user.__v': 0,
                'user.createdAt': 0,
                'user.updatedAt': 0,
            },
        };

        const pipeline: Array<mongoose.PipelineStage> = [sortStage, skipStage, limitStage, lookupStage, unwindStage, projectionStage];
        const patients = await PatientModel.aggregate(pipeline);
        const mentor = mentorId && await MentorModel.findById(mentorId);
        return patients.map(patient => ({...patient, isMine: mentor?.patients.includes(patient._id)}));
    }

    public static async getMonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage: mongoose.PipelineStage = {$sort: {firstName: 1, lastName: 1}};
        const skipStage: mongoose.PipelineStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage: mongoose.PipelineStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage: mongoose.PipelineStage = {
            $lookup: {
                from: MentorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'mentor',
            },
        };
        const matchStage: mongoose.PipelineStage = {$match: {mentor: {$exists: true}}};
        const unwindStage: mongoose.PipelineStage = {$unwind: {path: '$mentor', preserveNullAndEmptyArrays: true}};
        const pipeline: Array<mongoose.PipelineStage> = [lookupStage, unwindStage, matchStage, sortStage, skipStage, limitStage];

        return PatientModel.aggregate(pipeline);
    }

    public static async getUnmonitoredPatientsByPageNumber(page: number = 0): Promise<any[]> {
        const sortStage: mongoose.PipelineStage = {$sort: {firstName: 1, lastName: 1}};
        const skipStage: mongoose.PipelineStage = {$skip: page * this.PATIENTS_PAIR_PAGE};
        const limitStage: mongoose.PipelineStage = {$limit: this.PATIENTS_PAIR_PAGE};
        const lookupStage: mongoose.PipelineStage = {
            $lookup: {
                from: MentorModel.collection.name,
                localField: '_id',
                foreignField: 'patients',
                as: 'mentor',
            },
        };
        const matchStage: mongoose.PipelineStage = {$match: {mentor: {$exists: false}}};
        const unwindStage: mongoose.PipelineStage = {$unwind: {path: '$mentor', preserveNullAndEmptyArrays: true}};
        const pipeline: Array<mongoose.PipelineStage> = [lookupStage, unwindStage, matchStage, sortStage, skipStage, limitStage];

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
        const matchStage = {$match: {'user.nationalId': {$regex: `.*${text}.*`}}};
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
