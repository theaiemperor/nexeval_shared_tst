const isEven = (n: number): boolean => (n & 1) === 0;


const isOdd = (n: number): boolean => !isEven(n);

const isPrime = (n: number): boolean => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false;
    return true;
};

const factorial = (n: number): number => {
    if (n < 0) throw new Error("factorial: negative");
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
};

const gcd = (a: number, b: number): number => {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
};

const lcm = (a: number, b: number): number => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);


const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;


const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;


const roundTo = (n: number, decimals = 0): number => {
    const f = 10 ** decimals;
    return Math.round((n + Number.EPSILON) * f) / f;
};


const ceilTo = (n: number, step = 1): number => Math.ceil(n / step) * step;


const floorTo = (n: number, step = 1): number => Math.floor(n / step) * step;


const toPercent = (num: number, decimals = 0): string =>
    `${roundTo(num * 100, decimals)}%`;


const sum = (nums: number[]): number => nums.reduce((a, b) => a + b, 0);


const average = (nums: number[]): number => (nums.length ? sum(nums) / nums.length : 0);


const median = (nums: number[]): number => {
    if (!nums.length) return 0;
    const s = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};


const mode = (nums: number[]): number | null => {
    if (!nums.length) return null;
    const m = new Map<number, number>();
    nums.forEach((n) => m.set(n, (m.get(n) || 0) + 1));
    let best: number | null = null;
    let count = -1;
    m.forEach((c, n) => {
        if (c > count) { count = c; best = n; }
    });
    return best;
};


const variance = (nums: number[]): number => {
    if (nums.length <= 1) return 0;
    const avg = average(nums);
    return average(nums.map((n) => (n - avg) ** 2));
};


const formatWithCommas = (num: number, locale: Intl.LocalesArgument = "en-IN"): string =>
    new Intl.NumberFormat(locale).format(num);


const numberUtils = {
    isEven,
    isOdd,
    isPrime,
    factorial,
    gcd,
    lcm,
    randomInt,
    randomFloat,
    roundTo,
    ceilTo,
    floorTo,
    toPercent,
    sum,
    average,
    median,
    mode,
    variance,
    formatWithCommas
}

export default numberUtils;
