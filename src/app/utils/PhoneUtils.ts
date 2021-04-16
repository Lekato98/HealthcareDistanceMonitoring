const enum CountryAbbreviation {
    JOR = 'JOR',
}

class PhoneUtils {
    public static readonly phone = require('phone');
    public static readonly SUPPORTED_COUNTRY: CountryAbbreviation[] = [
        CountryAbbreviation.JOR,
    ];

    public static isSupportedCountry(countryAbbreviation: CountryAbbreviation) {
        return PhoneUtils.SUPPORTED_COUNTRY.includes(countryAbbreviation);
    }

    public static formatPhoneNumber(phoneNumber: string): string {
        const [formattedPhoneNumber] = PhoneUtils.phone(phoneNumber);
        return formattedPhoneNumber;
    }
}

export default PhoneUtils;
