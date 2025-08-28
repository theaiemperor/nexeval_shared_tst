import { AnyFn, Key } from "../../types/common.js";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));


async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
    let lastErr;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            if (i < retries - 1) await sleep(delay); // wait before retry
        }
    }
    throw lastErr;
}


function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
    ]);
}


// Executes function only after user stops triggering it
const debounce = <F extends AnyFn>(fn: F, wait = 300) => {
    let t: any;
    return (...args: Parameters<F>): void => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
};


// Limits function execution to once per time window; Prevents too many scroll or resize events; Button spam prevention
const throttle = <F extends AnyFn>(fn: F, wait = 300) => {
    let last = 0, t: any, storedArgs: any[] | null = null;
    const invoke = (args: any[]) => { last = Date.now(); fn(...args); };
    return (...args: Parameters<F>): void => {
        const now = Date.now();
        const remaining = wait - (now - last);
        storedArgs = args;
        if (remaining <= 0) {
            if (t) { clearTimeout(t); t = null; }
            invoke(storedArgs);
            storedArgs = null;
        } else if (!t) {
            t = setTimeout(() => {
                if (storedArgs) invoke(storedArgs);
                t = null; storedArgs = null;
            }, remaining);
        }
    };
};

const memoize = <F extends AnyFn>(fn: F, keyFn?: (...args: Parameters<F>) => Key) => {
    const cache = new Map<Key, ReturnType<F>>();
    return (...args: Parameters<F>): ReturnType<F> => {
        const key = keyFn ? keyFn(...args) : (args.length === 1 ? (args[0] as any) : JSON.stringify(args));
        if (cache.has(key)) return cache.get(key)!;
        const res = fn(...args);
        cache.set(key, res);
        return res;
    };
};


// Ensures a function is executed only once; Init configs, DB connection
const once = <F extends AnyFn>(fn: F): F => {
    let called = false, result: any;
    return ((...args: any[]) => {
        if (!called) { called = true; result = fn(...args); }
        return result;
    }) as F;
};


// Generates unique identifier (UUID v4-like); DB keys, session IDs
const uuid = (): string =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (crypto.getRandomValues?.(new Uint8Array(1))[0] ?? Math.floor(Math.random() * 256)) & 15;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });


// Short, secure, unique ID; Frontend-friendly IDs, React keys
const nanoid = (size = 21): string => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
    const bytes = (crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(size)) : Uint8Array.from({ length: size }, () => Math.floor(Math.random() * 256)));
    let id = "";
    for (let i = 0; i < size; i++) id += chars[bytes[i] & 63];
    return id;
};


const isPromise = <T = any>(v: any): v is Promise<T> =>
    !!v && (typeof v === "object" || typeof v === "function") && typeof v.then === "function";


// Similar to withTimeout but wraps externally; Critical API guards
const timeoutPromise = <T>(p: Promise<T>, ms: number): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("Timeout")), ms);
        p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
    });


// Copies ArrayBuffer / Uint8Array; File upload, crypto, binary manipulation
const cloneBuffer = (buf: ArrayBuffer | Uint8Array): Uint8Array => {
    const src = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    const out = new Uint8Array(src.length);
    out.set(src);
    return out;
};


// Safe JSON parsing; Prevents crashes on bad input
const parseJSONSafe = <T = any>(str: string, fallback: T): T => {
    try { return JSON.parse(str) as T; } catch { return fallback; }
};


// Pretty-print JSON; Logs, config dumps, debugging
const stringifyPretty = (obj: any, space = 2): string => JSON.stringify(obj, null, space);



// Retries with exponential backoff; Robust APIs, login attempts; Retry: 500ms → 1000ms → 2000ms
const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    baseDelay = 250
): Promise<T> => {
    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
        try { return await fn(); } catch (e) {
            lastErr = e;
            if (i < retries) await sleep(baseDelay * 2 ** i);
        }
    }
    throw lastErr;
};


// Checks if running in browser; SSR apps (Next.js), universal libs
const isBrowser = (): boolean => typeof window !== "undefined" && typeof document !== "undefined";


// Checks if running in Node.js; Same as above but server
const isNode = (): boolean => typeof process !== "undefined" && !!(process as any).versions?.node;


// Does nothing; Placeholder, default callbacks
const noop = (): void => { };


// Function piping (left → right); Clean function composition; pipe(add)(double)(square)
const pipe =
    <A extends any[], R1>(f1: (...a: A) => R1) =>
        <R2>(f2: (x: R1) => R2) =>
            <R3>(f3: (x: R2) => R3) =>
                (...args: A) =>
                    f3(f2(f1(...args)));



// Function composition (right → left); Alternative to pipe; compose(square, double, add)    
const compose =
    <R3, R2, R1>(f3: (x: R2) => R3, f2: (x: R1) => R2, f1: (...args: any[]) => R1) =>
        (...args: any[]): R3 =>
            f3(f2(f1(...args)));


// Run a function N times; Generate arrays, tests, mocks
const times = <T>(n: number, fn: (i: number) => T): T[] => {
    const out: T[] = [];
    for (let i = 0; i < n; i++) out.push(fn(i));
    return out;
};


// Measures execution time; Profiling APIs, perf tests
const benchmark = async <T>(fn: () => Promise<T> | T): Promise<{ ms: number; result: T }> => {
    const start = performance.now();
    const result = await fn();
    return { ms: performance.now() - start, result };
};

// Generator for ranges; For loops, pagination
function* rangeGenerator(start: number, end: number, step = 1): Generator<number> {
    if (step === 0) return;
    if (start <= end) for (let i = start; i < end; i += step) yield i;
    else for (let i = start; i > end; i -= Math.abs(step)) yield i;
}


// Currying function; FP utilities, libs like Ramda; curry(add)(2)(3) → 5
const curry = <F extends AnyFn>(fn: F) => {
    const curried = (...args: any[]): any =>
        args.length >= fn.length ? fn(...args) : (...rest: any[]) => curried(...args, ...rest);
    return curried as any as F;
};


// Partially applies args; Reuse functions with pre-filled args; partial(add, 2)(3) → 5
const partial = <F extends AnyFn>(fn: F, ...preset: any[]) =>
    ((...later: any[]) => fn(...preset, ...later)) as F;



const misc = {
    sleep,
    retry,
    withTimeout,
    debounce,
    throttle,
    memoize,
    once,
    uuid,
    nanoid,
    isPromise,
    timeoutPromise,
    cloneBuffer,
    parseJSONSafe,
    stringifyPretty,
    retryWithBackoff,
    isBrowser,
    isNode,
    noop,
    pipe,
    compose,
    times,
    benchmark,
    rangeGenerator,
    curry,
    partial
}

export default misc;
