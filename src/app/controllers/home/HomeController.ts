import { Request, Response } from 'express';
import { Injectable } from 'dependency-injection-v1';
import { HttpStatusCode } from '../../utils/HttpUtils';
import RoleService from '../../models/roles/RoleService';
import MonitorService from '../../models/roles/monitor/MonitorService';
import PatientService from '../../models/roles/patient/PatientService';
import DailyReportService from '../../models/reports/daily/DailyReportService';
import EmergencyService from '../../models/emergency/EmergencyService';
import { RoleName } from '../../models/user/UserModel';

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
            const monitorId = req.app.locals.jwt.roleId;
            const patients = await MonitorService.getMyPatients(monitorId);
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
            const allPatients = await PatientService.getPatientsByPageNumber(page);
            res.render('allPatients.ejs', {allPatients});
        } catch (e) {
            res.redirect('/500');
        }
    }

    public async reportListPage(req: Request, res: Response): Promise<void> {
        try {
            const nationalId = req.params.nationalId;
            const reports = await DailyReportService.getReportsByPatientId(nationalId);

            res.render('reportList.ejs', {reports});
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

    public async editProfilePage(req: Request, res: Response): Promise<void> {
        res.render('editProfile.ejs');
    }

    public async coordinatorPage(req: Request, res: Response): Promise<void> {
        try {
            const [doctors, monitors, pendingDoctors, pendingMonitors] = await Promise.all([
                RoleService.getActiveByRoleName(RoleName.DOCTOR),
                RoleService.getActiveByRoleName(RoleName.MONITOR),
                RoleService.getPendingByRoleName(RoleName.DOCTOR),
                RoleService.getPendingByRoleName(RoleName.MONITOR),
            ]);
            res.render('coordinator.ejs', {doctors, monitors, pendingDoctors, pendingMonitors});
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
}

export default HomeController;
