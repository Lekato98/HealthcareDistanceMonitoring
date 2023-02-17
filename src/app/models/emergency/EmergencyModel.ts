import { getModelForClass, ModelOptions, Pre, Prop, mongoose } from '@typegoose/typegoose';
import { BasePropOptions, IModelOptions, PropOptionsForString, Ref } from '@typegoose/typegoose/lib/types';
import { Patient } from '../roles/patient/PatientModel';
import EmergencyModelHooks from './EmergencyModelHooks';

const emergencyIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const patientTypeOptions: BasePropOptions = {
    type: () => String,
    required: true,
    ref: () => Patient,
    unique: true,
};

const reasonTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    minlength: [10, 'Too short report text'],
    maxlength: [1000, 'Too large report text'],
};

const schemaOptions: mongoose.SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'emergency_case',
    },
};

@Pre<Emergency>('validate', EmergencyModelHooks.preValidate)
@ModelOptions(modelOptions)
export class Emergency {
    @Prop(emergencyIdTypeOptions) _id: string;
    @Prop(patientTypeOptions) patient: Ref<Patient, string>;
    @Prop(reasonTypeOptions) reason: string;

    constructor(payload: IEmergency) {
        if (payload._id) {
            this._id = payload._id;
        }

        this.patient = payload.patient;
        this.reason = payload.reason;
    }
}

export interface IEmergency {
    _id ?: string;
    patient: string;
    reason: string;
}

const EmergencyModel = getModelForClass(Emergency);

export default EmergencyModel;
