import { Gender, User } from './UserModel';
import PhoneUtils from '../../utils/PhoneUtils';
import StringUtils from '../../utils/StringUtils';
import { nanoid } from 'nanoid';
import UserService from './UserService';

const bcrypt = require('bcrypt');

class UserModelHooks {
    public static async preCreation(user: User): Promise<void> {
        user._id = `user~${ nanoid() }`;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt); // hash password
        user.phoneNumber = PhoneUtils.formatPhoneNumber(user.phoneNumber); // reformat phone number
        user.homeAddress = StringUtils.capitalize(user.homeAddress); // jordan amman -> Jordan Amman
        user.avatar = (user.gender === Gender.MALE ? UserService.MALE_DEFAULT_AVATAR : UserService.FEMALE_DEFAULT_AVATAR);
    }
}

export default UserModelHooks;
