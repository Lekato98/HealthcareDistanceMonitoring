import {Injectable} from "dependency-injection-v1";
import {Request, Response} from "express";
import {SUCCESS, UNSUCCESSFUL} from "../../helpers/constants";
import {HttpStatusCode} from "../../utils/HttpUtils";
import DoctorAdviceService from "../../models/doctor-advice/DoctorAdviceService";
import {IDoctorAdvice} from "../../models/doctor-advice/DoctorAdviceModel";

@Injectable
class DoctorAdviceController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const {text} = req.body;
            const payload: IDoctorAdvice = {text, userId};
            const doctorAdvice = await DoctorAdviceService.createAdvice(payload);
            const body = {success: SUCCESS, doctorAdvice};
            res.status(HttpStatusCode.CREATED_SUCCESSFULLY).json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const doctorAdvices = await DoctorAdviceService.getAll();
            const body = {success: SUCCESS, doctorAdvices};
            res.status(HttpStatusCode.CREATED_SUCCESSFULLY).json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DoctorAdviceController;