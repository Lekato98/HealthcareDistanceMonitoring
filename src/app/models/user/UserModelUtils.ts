import { User } from './UserModel';
import { IMyObject } from '../../utils/ObjectUtils';

class UserModelUtils {
    public static createUserObjectFromObject(payload: IMyObject): object {
        const user = new User();
        const userObject: IMyObject = {};
        const propertiesToUpdate: string[] = Object.keys(user).filter(item => item in payload); // get only active property

        propertiesToUpdate.forEach((item) => userObject[item] = payload[item]); // get active keys with its value

        return userObject;
    }
}

export default UserModelUtils;
