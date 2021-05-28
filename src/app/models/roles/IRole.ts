import { DocumentType } from '@typegoose/typegoose';

export interface IActive {
    active?: boolean;
    status?: string;
}

export interface IRole extends IActive {
    _id?: string;
    userId: string;
}

export interface IRoleService {
    create(role: IRole): Promise<DocumentType<IRole>>;

    deleteOneByUserId(userId: string): Promise<DocumentType<IRole>>;
}

export const enum Status {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export default IRole;
