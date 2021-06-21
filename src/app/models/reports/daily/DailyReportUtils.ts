import {IDailyReport} from "./DailyReportModel";
import PatientModelUtils from "../../roles/patient/PatientModelUtils";
import {DocumentType} from "@typegoose/typegoose";

class DailyReportUtils {
    public static transform(report: DocumentType<IDailyReport>): any {
        return {
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
        }
    }
}

export default DailyReportUtils;
