import {PhoneNumberFormat, PhoneNumberType, PhoneNumberUtil} from 'google-libphonenumber';
import logger from '../logger/logger';
const phoneUtil = PhoneNumberUtil.getInstance();

const isValid = (number, country = 'GB') => {
    try {
        const parsed = phoneUtil.parse(number, country);

        if (phoneUtil.getRegionCodeForNumber(parsed) !== country) {
            return false;
        }

        return phoneUtil.isValidNumber(parsed);
    } catch (e) {
        logger.warn(
            'failed to validate number',
            {
                number,
                e
            }
        );

        return false;
    }
};

const getCountry = (number) => {
    try {
        const parsed = phoneUtil.parse(number.replace(/^00/, '+'));

        return phoneUtil.getRegionCodeForNumber(parsed);

    } catch (e) {
        logger.warn(
            'failed to parse number',
            {
                number,
                e
            }
        );

    }
};

const isMobile = (number, country) => phoneUtil.getNumberType(phoneUtil.parse(number, country)) === PhoneNumberType.MOBILE;

const format = (number, form = PhoneNumberFormat.INTERNATIONAL, country = 'GB') => {
    try {
        if (!isValid(number, country)) {
            return null;
        }

        const formatted = phoneUtil.format(phoneUtil.parse(number, country), form);

        return form === PhoneNumberFormat.INTERNATIONAL ? formatted.replace(/ /g, '') : formatted;
    } catch (e) {
        logger.warn(
            'failed to format number',
            {
                number,
                e
            }
        );

        return null;
    }
};

const getInternational = (number, country) => format(number, PhoneNumberFormat.INTERNATIONAL, country);
const getLocal = (number, country) => format(number, PhoneNumberFormat.NATIONAL, country);

export default {
    isValid,
    format,
    isMobile,
    getInternational,
    getLocal,
    getCountry
};
