import {DocumentType} from '@typegoose/typegoose';
import MentorModel, {IMentor, Mentor} from './MentorModel';
import {Status} from '../IRole';
import {INACTIVE} from '../../../helpers/constants';
import PatientModel, {IPatient, Patient} from '../patient/PatientModel';
import PatientService from '../patient/PatientService';
import UserModel, {User} from "../../user/UserModel";

class MentorService {
    public static readonly PATIENTS_LIMIT = 5;

    public static async create(payload: IMentor): Promise<DocumentType<Mentor>> {
        const mentor = new Mentor(payload);
        mentor.active = INACTIVE;
        mentor.status = Status.PENDING;
        return MentorModel.create(mentor);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Mentor>> {
        return MentorModel.findOneAndDelete({userId});
    }

    public static async findOneByUserId(userId: string): Promise<DocumentType<Mentor>> {
        return MentorModel.findOne({userId});
    }

    public static async isExistByUserId(userId: string): Promise<boolean> {
        return MentorModel.exists({userId});
    }

    public static async addPatient(mentorId: string, patientId: string): Promise<any> {
        const isPatientExist = await PatientModel.exists({_id: patientId});

        if (isPatientExist) {
            const mentor = await MentorModel.findById(mentorId);
            const canAddPatient = mentor?.patients.length < this.PATIENTS_LIMIT;
            if (mentor?.active && canAddPatient) {
                return MentorModel.updateOne({_id: mentorId}, {$addToSet: {patients: patientId}});
            } else {
                throw Error((mentor ? 'Full space!' : 'Forbidden you are not mentor!'));
            }
        } else {
            throw Error('Unknown patient!');
        }
    }

    public static async removePatient(mentorId: string, patientId: string): Promise<any> {
        return MentorModel.updateOne({_id: mentorId}, {$pull: {patients: patientId}});
    }

    public static async getMyPatients(mentorId: string): Promise<any> {
        const mentor = await MentorModel.findById(mentorId);
        const patients = mentor?.patients;
        return Promise.all(patients.map((patientId: any) => PatientService.findOneById(patientId)));
    }

    public static async getMentorByPatient(patientId: string): Promise<any> {
        const matchStage = {$match: {patients: patientId}};
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            }
        };
        const pipeline = [matchStage, lookupStage];

        return MentorModel.aggregate(pipeline);
    }

    public static async updateAdvice(mentorId: string, advice: string): Promise<any> {
        return MentorModel.updateOne({_id: mentorId}, {advice});
    }
}

export default MentorService;
