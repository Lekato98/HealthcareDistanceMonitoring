class StringUtils {
    public static capitalize(toCapitalize: string): string {
        return toCapitalize.split(' ').reduce((capitalizedString, item) =>
            capitalizedString + item.charAt(0).toUpperCase() + item.slice(1)
            , '');
    }
}

export default StringUtils;
