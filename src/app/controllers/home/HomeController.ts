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

@Injectable
class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        try {
            res.render('home');
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send(e.message);
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
                .map((report: any) => ({
                        _id: report._id,
                        patientId: report.patientId,
                        shortnessOfBreath: PatientModelUtils.healthStatusToString(report.shortnessOfBreath),
                        fatigue: PatientModelUtils.healthStatusToString(report.fatigue),
                        headache: PatientModelUtils.healthStatusToString(report.headache),
                        smell: PatientModelUtils.healthStatusToString(report.smell),
                        soreThroat: PatientModelUtils.healthStatusToString(report.soreThroat),
                        taste: PatientModelUtils.healthStatusToString(report.taste),
                        createdAt: report.createdAt,
                        updatedAt: report.updatedAt,
                    })
                );

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
            const emergencyCases = await EmergencyService.getAll();
            res.render('hospitalization.ejs', {emergencyCases});
        } catch (e) {
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
