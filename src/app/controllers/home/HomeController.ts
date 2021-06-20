import {Request, Response} from 'express';
import {Injectable} from 'dependency-injection-v1';
import {HttpStatusCode} from '../../utils/HttpUtils';
import RoleService from '../../models/roles/RoleService';
import MentorService from '../../models/roles/mentor/MentorService';
import PatientService from '../../models/roles/patient/PatientService';
import DailyReportService from '../../models/reports/daily/DailyReportService';
import EmergencyService from '../../models/emergency/EmergencyService';
import {RoleName} from '../../models/user/UserModel';
import ConversationService from "../../models/conversation/ConversationService";
import {IDailyReport} from "../../models/reports/daily/DailyReportModel";
import PatientModelUtils from "../../models/roles/patient/PatientModelUtils";
import DailyReportUtils from "../../models/reports/daily/DailyReportUtils";
import DoctorAdviceService from "../../models/doctor-advice/DoctorAdviceService";
import {Mentor} from "../../models/roles/mentor/MentorModel";

@Injectable
class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        try {
            const patientId = req.app.locals.jwt.roleId;
            const doctorAdvices = await DoctorAdviceService.getAll();
            const [myMentor] = patientId && await MentorService.getMentorByPatient(patientId);
            res.render('home', {doctorAdvices, myMentor});
        } catch (e) {
            console.log(e)
            res.redirect('/500');
        }
    }

    public async emergencyPage(req: Request, res: Response): Promise<void> {
        res.render('emergency.ejs');
    }

    public async monitoredPatientsPage(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = req.app.locals.jwt.roleId;
            const patients = await MentorService.getMyPatients(mentorId);
            res.render('monitorPatients.ejs', {patients});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async questionnairePage(req: Request, res: Response): Promise<void> {
        res.render('questionnaire.ejs');
    }

    public async allPatientsPage(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.query.page) || 0;
            const mentorId = req.app.locals.jwt.roleId;
            const allPatients = await PatientService.getPatientsByPageNumber(page, mentorId);
            res.render('allPatients.ejs', {allPatients});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async reportListPage(req: Request, res: Response): Promise<void> {
        try {
            const nationalId = req.params.nationalId;
            const reports = (await DailyReportService.getReportsByPatientId(nationalId))
                .map(DailyReportUtils.transform);

            res.render('reportList.ejs', {reports});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async mentorListPage(req: Request, res: Response): Promise<void> {
        try {
            const mentors = await RoleService.getAcceptedByRoleName('mentor');
            res.render('mentorList.ejs', {mentors});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async emergencyCasesPage(req: Request, res: Response): Promise<void> {
        try {
            const {roleId, roleName} = req.app.locals.jwt;
            let emergencyCases = await EmergencyService.getAll();

            if (roleName === RoleName.MENTOR) {
                const patients = await MentorService.getMyPatients(roleId);
                emergencyCases = emergencyCases.filter(({patient}: any) =>
                    patients.find(({_id}: any) => patient._id === _id)
                );
            }

            res.render('hospitalization.ejs', {emergencyCases});
        } catch (e) {
            console.log(e);
            res.redirect('/500');
        }
    }

    public async coordinatorPage(req: Request, res: Response): Promise<void> {
        try {
            const [doctors, mentors, pendingDoctors, pendingMentors, inactiveMentors, inactiveDoctors] = await Promise.all([
                RoleService.getActiveByRoleName(RoleName.DOCTOR),
                RoleService.getActiveByRoleName(RoleName.MENTOR),
                RoleService.getPendingByRoleName(RoleName.DOCTOR),
                RoleService.getPendingByRoleName(RoleName.MENTOR),
                RoleService.getInActiveByRoleName(RoleName.MENTOR),
                RoleService.getInActiveByRoleName(RoleName.DOCTOR),
            ]);

            res.render('coordinator.ejs', {
                doctors,
                mentors,
                pendingDoctors,
                pendingMentors,
                inactiveMentors,
                inactiveDoctors
            });
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async conversationsPage(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const conversations = await ConversationService.getAllByUserId(userId);
            res.render('contact', {conversations, conversation: null});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async conversationPage(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const {conversationId} = req.params;
            const conversations = await ConversationService.getAllByUserId(userId);
            const conversation = conversations.find(conversation => conversation._id === conversationId);
            if (!conversation) {
                res.redirect('/conversations');
            } else {
                res.render('contact', {conversations, conversation});
            }
        } catch (e) {
            res.redirect('/500');
        }
    }

    public advicePage(req: Request, res: Response): void {
        res.render('advice');
    }

    public async notFoundPage(req: Request, res: Response): Promise<void> {
        res.render('404');
    }

    public async serverErrorPage(req: Request, res: Response): Promise<void> {
        res.render('500');
    }

    public async unknownRouteRedirect(req: Request, res: Response): Promise<void> {
        res.redirect('/404');
    }
}

export default HomeController;
