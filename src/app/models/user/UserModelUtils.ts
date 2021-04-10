import { User } from './UserModel';
import { IMyObject } from '../../utils/ObjectUtils';

const bcrypt = require('bcrypt');

class UserModelUtils {
    public static async preSave(this: User): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // hash password
    }

    public static createUserObjectFromObject(payload: IMyObject): object {
        const user = new User(); // todo null create null object of user
        const userObject: IMyObject = {};
        const propertiesToUpdate: string[] = Object.keys(user).filter(item => item in payload); // get only active property

        propertiesToUpdate.forEach((item) => userObject[item] = payload[item]); // get active keys with its value

        return userObject;
    }
}

export default UserModelUtils;
