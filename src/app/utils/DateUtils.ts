class DateUtils {
    public static readonly DEFAULT_HOURS = 8;
    public static readonly DEFAULT_MINUTES = 0;
    public static readonly DEFAULT_SECONDS = 0;
    public static readonly DEFAULT_MS = 0;

    public static getDayReportTimeAfterNDays(nDays: number) {
        const date = new Date();
        date.setDate(new Date().getDate() + nDays);
        date.setHours(
            DateUtils.DEFAULT_HOURS,
            DateUtils.DEFAULT_MINUTES,
            DateUtils.DEFAULT_SECONDS,
            DateUtils.DEFAULT_MS,
        );

        return date;
    }
}

export default DateUtils;
