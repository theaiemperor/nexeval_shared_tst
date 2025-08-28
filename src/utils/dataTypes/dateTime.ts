const nowISO = (): string => new Date().toISOString();


const nowUnix = (): number => Math.floor(Date.now() / 1000);


const formatDate = (date: Date | number | string, locale = "en-IN", opts?: Intl.DateTimeFormatOptions): string =>
    new Intl.DateTimeFormat(locale, opts ?? {
        year: "numeric", month: "short", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
    }).format(new Date(date));


const addDays = (date: Date | number | string, n: number): Date => {
    const d = new Date(date); d.setDate(d.getDate() + n); return d;
};


const addMonths = (date: Date | number | string, n: number): Date => {
    const d = new Date(date); d.setMonth(d.getMonth() + n); return d;
};


const addYears = (date: Date | number | string, n: number): Date => {
    const d = new Date(date); d.setFullYear(d.getFullYear() + n); return d;
};


const isLeapYear = (year: number = new Date().getFullYear()): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;


const daysBetween = (d1: Date | number | string, d2: Date | number | string): number => {
    const a = new Date(d1), b = new Date(d2);
    const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24));
};


const weeksBetween = (d1: Date | number | string, d2: Date | number | string): number =>
    Math.floor(Math.abs(daysBetween(d1, d2)) / 7);


const monthsBetween = (d1: Date | number | string, d2: Date | number | string): number => {
    const a = new Date(d1), b = new Date(d2);
    return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
};


const yearsBetween = (d1: Date | number | string, d2: Date | number | string): number =>
    Math.abs(new Date(d2).getFullYear() - new Date(d1).getFullYear());


const startOfDay = (d: Date | number | string): Date => {
    const x = new Date(d); x.setHours(0, 0, 0, 0); return x;
};


const endOfDay = (d: Date | number | string): Date => {
    const x = new Date(d); x.setHours(23, 59, 59, 999); return x;
};


const startOfWeek = (d: Date | number | string, firstDay: 0 | 1 = 1): Date => {
    const x = new Date(d);
    const day = x.getDay();
    const diff = (day < firstDay ? 7 : 0) + day - firstDay;
    x.setDate(x.getDate() - diff);
    x.setHours(0, 0, 0, 0);
    return x;
};


const endOfWeek = (d: Date | number | string, firstDay: 0 | 1 = 1): Date =>
    endOfDay(addDays(startOfWeek(d, firstDay), 6));


const startOfMonth = (d: Date | number | string): Date => {
    const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x;
};


const endOfMonth = (d: Date | number | string): Date => {
    const x = new Date(d);
    x.setMonth(x.getMonth() + 1, 0);
    x.setHours(23, 59, 59, 999);
    return x;
};


const toUnix = (d: Date | number | string): number => Math.floor(new Date(d).getTime() / 1000);


const fromUnix = (ts: number): Date => new Date(ts * 1000);


const isToday = (d: Date | number | string): boolean => {
    const x = new Date(d), n = new Date();
    return x.toDateString() === n.toDateString();
};


const isTomorrow = (d: Date | number | string): boolean =>
    startOfDay(d).getTime() === startOfDay(addDays(new Date(), 1)).getTime();


const isYesterday = (d: Date | number | string): boolean =>
    startOfDay(d).getTime() === startOfDay(addDays(new Date(), -1)).getTime();


const formatRelative = (d: Date | number | string, base: Date = new Date()): string => {
    const diff = +new Date(d) - +base;
    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const table: [number, Intl.RelativeTimeFormatUnit][] = [
        [60_000, "minute"],
        [3_600_000, "hour"],
        [86_400_000, "day"],
        [604_800_000, "week"],
        [2_592_000_000, "month"],
        [31_536_000_000, "year"],
    ];
    for (const [unitMs, unit] of table) {
        if (abs < unitMs) {
            const prev = table[table.indexOf([unitMs, unit]) - 1];
            if (!prev) return rtf.format(Math.round(diff / 1000), "second");
            const [ms, u] = prev;
            return rtf.format(Math.round(diff / ms), u as any);
        }
    }
    return rtf.format(Math.round(diff / 31_536_000_000), "year");
};


const calendarFormat = (d: Date | number | string): string => {
    const date = new Date(d);
    const today = startOfDay(new Date()).getTime();
    const that = startOfDay(date).getTime();
    const diffDays = Math.round((that - today) / 86_400_000);
    const options: Intl.DateTimeFormatOptions = { weekday: "long", hour: "2-digit", minute: "2-digit" };
    if (diffDays === 0) return `Today at ${formatDate(date, undefined, { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return `Tomorrow at ${formatDate(date, undefined, { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === -1) return `Yesterday at ${formatDate(date, undefined, { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays > 1 && diffDays < 7) return new Intl.DateTimeFormat(undefined, options).format(date);
    return formatDate(date);
};


const dateTime = {
    nowISO,
    nowUnix,
    formatDate,
    addDays,
    addMonths,
    addYears,
    isLeapYear,
    daysBetween,
    weeksBetween,
    monthsBetween,
    yearsBetween,
    startOfDay,
    startOfWeek,
    startOfMonth,
    endOfDay,
    endOfWeek,
    endOfMonth,
    toUnix,
    fromUnix,
    isToday,
    isTomorrow,
    isYesterday,
    formatRelative,
    calendarFormat
}

export default dateTime;
