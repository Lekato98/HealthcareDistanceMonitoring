import { DocumentType } from '@typegoose/typegoose';

interface IActive {
    active?: boolean;
    status?: string;
}

interface IRole extends IActive {
    _id?: string;
    userId: string;
}

export interface IRoleService {
    create(role: IRole): Promise<DocumentType<IRole>>;
    deleteOneByUserId(userId: string): Promise<DocumentType<IRole>>;
}

export const enum Status {
    NO_STATUS = 'no status',
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export default IRole;
