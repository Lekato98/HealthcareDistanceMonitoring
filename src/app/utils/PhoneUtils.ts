const enum CountryAbbreviation {
    JOR = 'JOR',
}

class PhoneUtils {
    public static readonly phone = require('phone');
    public static readonly jordanNumberRegex = /^(009627|9627|\+9627|07)(7|8|9)([0-9]{7})$/;
    public static readonly SUPPORTED_COUNTRY: CountryAbbreviation[] = [
        CountryAbbreviation.JOR,
    ];

    public static isSupportedCountry(countryAbbreviation: CountryAbbreviation) {
        return PhoneUtils.SUPPORTED_COUNTRY.includes(countryAbbreviation);
    }

    public static formatPhoneNumber(phoneNumber: string): string {
        const [formattedPhoneNumber] = PhoneUtils.phone(phoneNumber);
        return formattedPhoneNumber || phoneNumber;
    }

    public static isValidJordanNumber(phoneNumber: string): boolean {
        return !!phoneNumber.match(PhoneUtils.jordanNumberRegex);
    }
}

export default PhoneUtils;
