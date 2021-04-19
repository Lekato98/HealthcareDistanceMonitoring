import { DocumentType } from '@typegoose/typegoose';
import IRole, { Status } from './IRole';
import RoleFactory from './RoleFactory';
import RoleUtils from './RoleUtils';

class RoleService {
    public static readonly USER_PROJECTION = '-password -createdAt -updatedAt -__v';

    public static async createRole(roleName: string, payload: IRole): Promise<DocumentType<IRole>> {
        const roleService = RoleUtils.getServiceByRoleName(roleName);
        const role = RoleFactory.create(roleName, payload);
        return roleService.create(role);
    }

    public static async deleteOneRole(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.findOneAndDelete({userId});
    }

    public static async deleteAllRoles(userId: string): Promise<Array<any>> {
        const roleServices = RoleUtils.getAllServices();
        return Promise.all(roleServices.map((roleService) => roleService.deleteOneByUserId(userId)));
    }

    public static async getActiveByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({active: true}).populate('userId', this.USER_PROJECTION);
    }

    public static async getInActiveByRoleName(roleName: string): Promise<DocumentType<IRole>[]> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.find({active: false}).populate('userId', this.USER_PROJECTION);
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
        return roleModel.updateOne({userId}, {status: Status.ACCEPTED, active: true});
    }

    public static rejectByRoleName(roleName: string, userId: string): Promise<DocumentType<IRole>> {
        const roleModel = RoleUtils.getModelByRoleName(roleName);
        return roleModel.updateOne({userId}, {status: Status.REJECTED, active: false});
    }
}

export default RoleService;
