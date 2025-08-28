const uniqueElements = <T>(arr: T[]): T[] => Array.from(new Set(arr));


const deepFlatten = <T>(arr: any[]): T[] =>
    arr.reduce<T[]>((acc, v) => acc.concat(Array.isArray(v) ? deepFlatten<T>(v) : v), []);


const chunk = <T>(arr: T[], size: number): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};


// Remove null, false, undefined etc. values from array
const compact = <T>(arr: (T | false | null | undefined | 0 | "")[]): T[] =>
    arr.filter(Boolean) as T[];


const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const sample = <T>(arr: T[]): T | undefined =>
    arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

const intersection = <T>(a: T[], b: T[]): T[] => {
    const setB = new Set(b);
    return a.filter((x) => setB.has(x));
};

const difference = <T>(a: T[], b: T[]): T[] => {
    const setB = new Set(b);
    return a.filter((x) => !setB.has(x));
};

const union = <T>(a: T[], b: T[]): T[] => uniqueElements([...a, ...b]);

const partition = <T>(arr: T[], predicate: (v: T) => boolean): [T[], T[]] => {
    const truthy: T[] = [], falsy: T[] = [];
    arr.forEach((v) => (predicate(v) ? truthy : falsy).push(v));
    return [truthy, falsy];
};

const remove = <T>(arr: T[], value: T): T[] => arr.filter((v) => v !== value);

const last = <T>(arr: T[]): T | undefined => (arr.length ? arr[arr.length - 1] : undefined);

const nth = <T>(arr: T[], n: number): T | undefined => {
    const idx = n < 0 ? arr.length + n : n;
    return arr[idx];
};

const zip = <A, B>(a: A[], b: B[]): [A, B][] => {
    const len = Math.min(a.length, b.length);
    const out: [A, B][] = [];
    for (let i = 0; i < len; i++) out.push([a[i], b[i]]);
    return out;
};

const unzip = <A, B>(pairs: [A, B][]): [A[], B[]] => {
    const a: A[] = [], b: B[] = [];
    for (const [x, y] of pairs) { a.push(x); b.push(y); }
    return [a, b];
};

const range = (start: number, end: number, step = 1): number[] => {
    const out: number[] = [];
    if (step === 0) return out;
    const dir = Math.sign(end - start) || (step > 0 ? 1 : -1);
    if (dir > 0) for (let i = start; i < end; i += Math.abs(step)) out.push(i);
    else for (let i = start; i > end; i -= Math.abs(step)) out.push(i);
    return out;
};

const move = <T>(arr: T[], from: number, to: number): T[] => {
    const a = [...arr];
    const item = a.splice(from, 1)[0];
    a.splice(Math.max(0, Math.min(a.length, to)), 0, item);
    return a;
};

const rotate = <T>(arr: T[], steps: number): T[] => {
    const a = [...arr];
    const k = ((steps % a.length) + a.length) % a.length;
    return a.slice(-k).concat(a.slice(0, -k));
};

const uniqueBy = <T, K>(arr: T[], keyFn: (v: T) => K): T[] => {
    const seen = new Set<K>();
    const out: T[] = [];
    for (const item of arr) {
        const k = keyFn(item);
        if (!seen.has(k)) { seen.add(k); out.push(item); }
    }
    return out;
};


const arrayUtils = {
    uniqueElements,
    deepFlatten,
    chunk,
    compact,
    shuffle,
    sample,
    intersection,
    difference,
    union,
    partition,
    remove,
    last,
    nth,
    zip,
    unzip,
    range,
    move,
    rotate,
    uniqueBy
}


export default arrayUtils;
