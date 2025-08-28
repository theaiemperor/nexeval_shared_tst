import { AnyObj, Key } from "../../types/common.js";


const isObject = (v: unknown): v is Record<string, any> =>
    v !== null && typeof v === "object";


const deepClone = <T>(obj: T): T => {
    if (!isObject(obj)) return obj as T;
    if (obj instanceof Date) return new Date(obj) as any;
    if (Array.isArray(obj)) return obj.map((v) => deepClone(v)) as any;
    if (obj instanceof Map) return new Map(Array.from(obj, ([k, v]) => [k, deepClone(v)])) as any;
    if (obj instanceof Set) return new Set(Array.from(obj, (v) => deepClone(v))) as any;
    const out: AnyObj = {};
    for (const k in obj as AnyObj) out[k] = deepClone((obj as AnyObj)[k]);
    return out as T;
};


const isEmptyObject = (obj: unknown): obj is object =>
    isObject(obj) && Object.keys(obj).length === 0;


const merge = <T extends AnyObj, U extends AnyObj>(a: T, b: U): T & U =>
    Object.assign({}, a, b);


const deepMerge = <T extends AnyObj, U extends AnyObj>(a: T, b: U): T & U => {
    const out: AnyObj = { ...a };
    for (const [k, v] of Object.entries(b)) {
        if (isObject(v) && isObject(out[k])) out[k] = deepMerge(out[k], v);
        else out[k] = deepClone(v);
    }
    return out as T & U;
};


const omit = <T extends AnyObj, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const out = { ...obj };
    for (const k of keys) delete out[k];
    return out;
};


const pick = <T extends AnyObj, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const out = {} as Pick<T, K>;
    for (const k of keys) if (k in obj) out[k] = obj[k];
    return out;
};


const invert = <T extends Record<string, Key>>(obj: T): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) out[String(v)] = k;
    return out;
};


const mapKeys = <T extends AnyObj>(
    obj: T,
    fn: (key: keyof T, value: T[keyof T]) => Key
): AnyObj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k as keyof T, v as any), v]));


const mapValues = <T extends AnyObj, R>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v as any, k as keyof T)])) as any;


const filterObject = <T extends AnyObj>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> =>
    Object.fromEntries(Object.entries(obj).filter(([k, v]) => fn(v as any, k as keyof T))) as Partial<T>;


const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T =>
    key in obj;


const getNested = <T, D = undefined>(obj: any, path: string | (string | number)[], def?: D): T | D => {
    const parts = Array.isArray(path) ? path : path.split(".").map(p => (p.match(/^\d+$/) ? Number(p) : p));
    let cur: any = obj;
    for (const p of parts) {
        if (cur == null) return def as D;
        cur = cur[p as any];
    }
    return (cur === undefined ? def : cur) as any;
};


const setNested = (obj: AnyObj, path: string | (string | number)[], value: any): AnyObj => {
    const parts = Array.isArray(path) ? path : path.split(".").map(p => (p.match(/^\d+$/) ? Number(p) : p));
    let cur: any = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!isObject(cur[p])) cur[p] = typeof parts[i + 1] === "number" ? [] : {};
        cur = cur[p];
    }
    cur[parts[parts.length - 1] as any] = value;
    return obj;
};


const deleteNested = (obj: AnyObj, path: string | (string | number)[]): boolean => {
    const parts = Array.isArray(path) ? path : path.split(".").map(p => (p.match(/^\d+$/) ? Number(p) : p));
    let cur: any = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!isObject(cur[p])) return false;
        cur = cur[p];
    }
    return delete cur[parts[parts.length - 1] as any];
};


const deepEqual = (a: any, b: any): boolean => {
    if (Object.is(a, b)) return true;
    if (typeof a !== typeof b) return false;
    if (a && b && typeof a === "object") {
        if (a.constructor !== b.constructor) return false;
        if (a instanceof Date) return a.getTime() === b.getTime();
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
            return true;
        }
        const ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
        return true;
    }
    return false;
};


const size = (obj: object): number => Object.keys(obj).length;


const freezeDeep = <T>(obj: T): T => {
    if (!isObject(obj)) return obj;
    Object.freeze(obj);
    for (const k of Object.keys(obj)) {
        const v: any = (obj as AnyObj)[k];
        if (isObject(v) && !Object.isFrozen(v)) freezeDeep(v);
    }
    return obj;
};


const unfreeze = <T>(obj: T): T => deepClone(obj);


const cloneShallow = <T extends AnyObj>(obj: T): T => ({ ...obj });


const sortKeys = <T extends AnyObj>(obj: T): T =>
    Object.fromEntries(Object.keys(obj).sort().map((k) => [k, (obj as AnyObj)[k]])) as T;


const values = Object.values as <T extends AnyObj>(obj: T) => Array<T[keyof T]>;


const keys = Object.keys as <T extends AnyObj>(obj: T) => Array<keyof T>;


const entries = Object.entries as <T extends AnyObj>(obj: T) => Array<[keyof T, T[keyof T]]>;


const fromEntries = <K extends PropertyKey, V>(entries: Iterable<readonly [K, V]>): Record<K, V> =>
    Object.fromEntries(entries) as Record<K, V>;

// Converts object → query string
const objectToQuery = (obj: Record<string, any>): string =>
    Object.entries(obj)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => {
            if (typeof v === "object" && !Array.isArray(v)) {
                // encode nested object as JSON
                return `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`;
            } else if (Array.isArray(v)) {
                // arrays → comma separated
                return `${encodeURIComponent(k)}=${encodeURIComponent(v.join(","))}`;
            } else {
                return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
            }
        })
        .join("&");


// Converts query string → object
const queryToObject = (query: string): Record<string, any> => {
    return query
        .replace(/^\?/, "")
        .split("&")
        .filter(Boolean)
        .reduce<Record<string, any>>((acc, pair) => {
            const [key, value = ""] = pair.split("=");
            const decodedKey = decodeURIComponent(key);
            const decodedValue = decodeURIComponent(value);

            // Already set? → convert to array
            const addValue = (val: any) => {
                if (acc[decodedKey]) {
                    acc[decodedKey] = Array.isArray(acc[decodedKey])
                        ? [...acc[decodedKey], val]
                        : [acc[decodedKey], val];
                } else {
                    acc[decodedKey] = val;
                }
            };

            try {
                // Try parse JSON objects (like {"x":1})
                const parsed = JSON.parse(decodedValue);
                addValue(parsed);
            } catch {
                // Handle comma-separated arrays
                if (decodedValue.includes(",")) {
                    const arr = decodedValue.split(",").map(v => v.trim());
                    addValue(arr);
                } else {
                    addValue(decodedValue);
                }
            }

            return acc;
        }, {});
};


const objectUtils = {
    isObject,
    deepClone,
    isEmptyObject,
    merge,
    deepMerge,
    omit,
    pick,
    invert,
    mapKeys,
    mapValues,
    filterObject,
    hasKey,
    getNested,
    setNested,
    deleteNested,
    deepEqual,
    size,
    freezeDeep,
    unfreeze,
    cloneShallow,
    sortKeys,
    values,
    keys,
    entries,
    fromEntries,
    objectToQuery,
    queryToObject
}

export default objectUtils;
