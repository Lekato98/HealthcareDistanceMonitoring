class DateUtils {
    public static readonly DEFAULT_HOURS = 8;
    public static readonly DEFAULT_MINUTES = 0;
    public static readonly DEFAULT_SECONDS = 0;
    public static readonly DEFAULT_MS = 0;

    public static getDayReportTimeAfterNDays(nDays: number) {
        const currentDate = new Date();
        const date = currentDate;
        date.setDate(currentDate.getDate() + nDays);
        date.setHours(
            DateUtils.DEFAULT_HOURS,
            DateUtils.DEFAULT_MINUTES,
            DateUtils.DEFAULT_SECONDS,
            DateUtils.DEFAULT_MS,
        );

        if (date <= currentDate) {
            date.setDate(currentDate.getDate() + 1);
        }

        return date;
    }
}

export default DateUtils;
