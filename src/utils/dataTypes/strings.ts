const randomId = (len = 8) =>
    Math
        .random()
        .toString(36)
        .substring(2, 2 + len);


const capitalize = (str: string) =>
    str.length ?
        str[0].toUpperCase() + str.slice(1) :
        str;


const toCamelCase = (str: string) =>
    str
        .replace(/[_-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^(.)/, (m) => m.toLowerCase());


const toSnakeCase = (str: string) =>
    str
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();


const toKebabCase = (str: string) =>
    str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();


const trimAll = (str: string): string =>
    str
        .trim()
        .replace(/\s+/g, " ");


const truncate = (str: string, len: number, ellipsis = "…") =>
    str.length > len ?
        str.slice(0, Math.max(0, len - ellipsis.length)) + ellipsis :
        str;


const stripHTML = (str: string) =>
    str
        .replace(/<[^>]*>/g, "");


const reverseString = (str: string) =>
    [...str]
        .reverse()
        .join("");


const countWords = (str: string): number =>
    (str.trim().match(/\b[\p{L}\p{N}'-]+\b/gu) || []).length;


const replaceAll = (str: string, search: string | RegExp, replace: string): string =>
    typeof search === "string"
        ? str.split(search).join(replace)
        : str.replace(new RegExp(search, search.flags.includes("g") ? search.flags : search.flags + "g"), replace);


const removeSpecialChars = (str: string) => str.replace(/[^a-z0-9\s]/gi, "");


const extractEmails = (str: string): string[] =>
    Array
        .from(str.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi))
        .map((m) => m[0]);


const extractURLs = (str: string): string[] =>
    Array.from(
        str.matchAll(
            /\b((?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*)/gi
        )
    ).map((m) => m[0]);


const repeatString = (str: string, times: number) =>
    times <= 0 ? "" : new Array(times + 1).join(str);


const stringUtils = {
    randomId,
    capitalize,
    toCamelCase,
    toKebabCase,
    toSnakeCase,
    trimAll,
    truncate,
    stripHTML,
    reverseString,
    countWords,
    replaceAll,
    removeSpecialChars,
    extractEmails,
    extractURLs,
    repeatString
}

export default stringUtils;
