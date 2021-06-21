import { User } from './UserModel';
import { IMyObject } from '../../utils/ObjectUtils';

class UserModelUtils {
    public static userObjectForUpdate(payload: IMyObject): object {
        const user = new User();
        const userObject: IMyObject = {};

        // get only active property
        const propertiesToUpdate: string[] = Object.keys(user).filter(item => item in payload);

        // get active keys with its value
        propertiesToUpdate.forEach((item) => userObject[item] = payload[item]);

        delete userObject.password;
        return userObject;
    }
}

export default UserModelUtils;
