import { IObj } from "../../types/common.js";


export function saveToStorage<T = IObj>(key: string, data: T): boolean {
    if (typeof window !== undefined) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;

        } catch (error) {
            return false;
        }
    }

    return false;
}



export function getFromStorage<T = IObj>(key: string): T | void {

    if (typeof window !== undefined) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return;

            return JSON.parse(data) as T;

        } catch (error) {
            return;
        }
    }
}