import { RoleName } from '../user/UserModel';
import IRole from './IRole';
import RoleFactory from './RoleFactory';
import { DocumentType } from '@typegoose/typegoose';

class RoleService {
    public static async createRole(roleName: RoleName, payload: IRole): Promise<DocumentType<IRole>> {
        const role: DocumentType<IRole> = RoleFactory.create(roleName, payload);
        return role.save();
    }
}

export default RoleService;
