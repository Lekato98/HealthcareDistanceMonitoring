import { RoleName } from './UserModel';
import PhoneUtils from '../../utils/PhoneUtils';

class UserValidator {
    public static readonly jordanNationalIdRegex = /^([9][0-9]{2}[12][0][0-9]{5})|([2][0]{2}[0-9]{7})$/;

    public static nationalIdValidator(value: string): boolean {
        return !!value.match(UserValidator.jordanNationalIdRegex);
    }

    public static rolesValidator(value: RoleName[]): boolean {
        // 3 -> total number of roles
        return value.length <= 3 && value.reduce(
            (prev: boolean, role: RoleName) => prev &&
                (role === RoleName.PATIENT || role === RoleName.MENTOR || role === RoleName.DOCTOR),
            true, // default if empty = true
        );
    }

    public static phoneNumberValidator(phoneNumber: string): boolean {
        return PhoneUtils.isValidJordanNumber(phoneNumber);
    }

}

export default UserValidator;
