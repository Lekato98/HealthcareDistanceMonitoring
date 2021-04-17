interface IActive {
    active: boolean;
}

interface IRole extends IActive {
    userId: string;
}

export default IRole;
