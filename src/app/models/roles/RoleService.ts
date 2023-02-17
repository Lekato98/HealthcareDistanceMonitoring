import {DocumentType, mongoose} from '@typegoose/typegoose';
import IRole, {Status} from './IRole';
import RoleFactory from './RoleFactory';
import RoleUtils from './RoleUtils';
import {ACTIVE, INACTIVE} from '../../helpers/constants';
import {RoleName} from "../user/UserModel";

class RoleService {
    public static readonly USER_PROJECTION = '-password -createdAt -updatedAt -__v';

    public static async createRole(roleName: string, payload: IRole): Promise<DocumentType<IRole>> {
        const roleService = RoleUtils.getServiceByRoleName(roleName);
        const role = RoleFactory.create(roleName, payload);
        return roleService.create(role);
    }

    public static async deactivateOneRole(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.findOneAndUpdate({userId}, {active: INACTIVE});
    }

    public static async deleteAllRoles(userId: string): Promise<Array<any>> {
        const roleServices = RoleUtils.getAllServices();
        return Promise.all(roleServices.map((roleService) => roleService.deleteOneByUserId(userId)));
    }

    public static async getActiveByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({active: ACTIVE}).populate('userId', this.USER_PROJECTION);
    }

    public static async getInActiveByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({active: INACTIVE}).populate('userId', this.USER_PROJECTION);
    }

    public static async getAcceptedByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({status: Status.ACCEPTED}).populate('userId', this.USER_PROJECTION);
    }

    public static async getRejectedByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({status: Status.REJECTED}).populate('userId', this.USER_PROJECTION);
    }

    public static async getPendingByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({status: Status.PENDING}).populate('userId', this.USER_PROJECTION);
    }

    public static acceptByRoleName(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        const pipeline = [
            {
                $set: {
                    active: ACTIVE,
                    status: Status.ACCEPTED,
                },
            },
        ];

        const options: mongoose.QueryOptions = {
            runValidators: true,
            multi: true,
        };

        return roleModel.updateOne({userId}, pipeline, options);
    }

    public static rejectByRoleName(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        const pipeline = [
            {
                $set: {
                    active: INACTIVE,
                    status: Status.REJECTED,
                },
            },
        ];

        return roleModel.updateOne({userId}, pipeline, {runValidators: true});
    }

    public static async getUserRole(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.findOne({userId});
    }

    public static async getUserRoles(userId: string): Promise<DocumentType<IRole>[]> {
        return await Promise.all([
            RoleService.getUserRole(RoleName.PATIENT, userId),
            RoleService.getUserRole(RoleName.MENTOR, userId),
            RoleService.getUserRole(RoleName.DOCTOR, userId),
        ]);
    }

    public static async isExistRole(userId: string, roleName: string): Promise<boolean> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.exists({userId, active: ACTIVE});
    }
}

export default RoleService;
