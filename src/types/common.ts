export type IObj<T=any> = Record<string, T>;

export type AnyFn = (...args: any[]) => any;

export type Primitive = string | number | boolean | null | undefined | symbol | bigint;

export type Key = string | number | symbol;

export type AnyObj = Record<string, any>;
