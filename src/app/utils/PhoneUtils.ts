const enum CountryAbbreviation {
    JO = 'JOR',
}

class PhoneUtils {
    public static readonly phone = require('phone');
    public static readonly SUPPORTED_COUNTRY: CountryAbbreviation[] = [
        CountryAbbreviation.JO
    ];

    public static validatePhoneNumber(phoneNumber: string): boolean {
        const [_, countryAbbreviation] = PhoneUtils.phone(phoneNumber);
        return PhoneUtils.SUPPORTED_COUNTRY.includes(countryAbbreviation);
    }

    public static formatPhoneNumber(phoneNumber: string): string {
        const [formattedPhoneNumber, _] = PhoneUtils.phone(phoneNumber);
        return formattedPhoneNumber;
    }
}

export default PhoneUtils;
