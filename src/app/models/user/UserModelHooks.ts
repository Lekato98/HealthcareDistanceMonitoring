import { User } from './UserModel';
import PhoneUtils from '../../utils/PhoneUtils';
import StringUtils from '../../utils/StringUtils';
import { nanoid } from 'nanoid';

const bcrypt = require('bcrypt');

class UserModelHooks {
    public static preValidate(this: User): void {
        this._id = `user~${ nanoid() }`;
    }

    public static async preSave(this: User): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // hash password
        this.phoneNumber = PhoneUtils.formatPhoneNumber(this.phoneNumber); // reformat phone number
        this.homeAddress = StringUtils.capitalize(this.homeAddress); // jordan amman -> Jordan Amman
    }
}

export default UserModelHooks;
