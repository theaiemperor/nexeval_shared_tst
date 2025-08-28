import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { IObj } from "../../../types/common.js";
import { APIResponse, APIResponseError, APIResponseSuccess } from "../../../server/lib/express/response/apiResponseTypes.js";



type HTTPMethods = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

type ComonMeta = { status: number, statusText: string };


type HTTPImpl = <
    ResData = IObj,
    ErrData = IObj,
    ResMeta extends object = ComonMeta,
    ErrMeta extends object = ComonMeta
>(url: string, config?: AxiosRequestConfig) =>
    Promise<APIResponse<ResData, ErrData, ResMeta, ErrMeta>>



export class APIClient {
    instance: AxiosInstance;

    constructor(instance?: AxiosInstance) {
        this.instance = instance || axios.create();
    }


    private handleAxiosError<U, ErrMeta extends object>(err: any): APIResponseError<U, ErrMeta & ComonMeta> {
        if (err instanceof AxiosError && err.response) {
            const axiosErr = err.response.data;

            return {
                ...axiosErr,
                meta: {
                    ...axiosErr.meta,
                    status: err.status,
                    statusText: err.code
                }
            };
        }

        return {
            success: false,
            message: "Something went wrong",
            data: {} as U,
            meta: {
                status: 0,
                statusText: 'Unknown error'
            } as ErrMeta & ComonMeta
        }
    }



    //  Overloads for strong typings
    createHandler(method: "get" | "delete" | "head" | "options"): <
        ResData = any,
        ErrData = IObj,
        ResMeta extends object = ComonMeta,
        ErrMeta extends object = ComonMeta
    >(
        url: string,
        config?: AxiosRequestConfig
    ) => Promise<APIResponse<ResData, ErrData, ResMeta & ComonMeta, ErrMeta & ComonMeta>>;

    createHandler(method: "post" | "put" | "patch"): <
        body = any,
        ResData = IObj,
        ErrData = IObj,
        ResMeta extends object = ComonMeta,
        ErrMeta extends object = ComonMeta
    >(
        url: string,
        data?: body,
        config?: AxiosRequestConfig
    ) => Promise<APIResponse<ResData, ErrData, ResMeta & ComonMeta, ErrMeta & ComonMeta>>;


    // implementation of above method
    createHandler(method: HTTPMethods) {

        const isDataMethod = ['post', 'put', 'patch'].includes(method);

        if (isDataMethod) {
            return async <body = any, ResData = IObj, ErrData = IObj, ResMeta extends object = IObj, ErrMeta extends object = IObj>(
                url: string,
                data?: body,
                config?: AxiosRequestConfig
            ): Promise<APIResponse<ResData, ErrData, ResMeta & ComonMeta, ErrMeta & ComonMeta>> => {

                try {
                    const res = await (this.instance as AxiosInstance)[method]<ResData>(url, data, config);
                    const result = res.data as APIResponseSuccess<ResData, ResMeta & ComonMeta>;
                    return {
                        ...result,
                        meta: {
                            ...result.meta,
                            status: res.status,
                            statusText: res.statusText
                        }
                    };

                } catch (err) {
                    return this.handleAxiosError<ErrData, ErrMeta & ComonMeta>(err);
                }
            }
        }


        return async <ResData = IObj, ErrData = IObj, ResMeta extends object = IObj, ErrMeta extends object = IObj>(
            url: string,
            config?: AxiosRequestConfig
        ): Promise<APIResponse<ResData, ErrData, ResMeta, ErrMeta>> => {
            try {
                const res = await (this.instance as AxiosInstance)[method]<ResData>(url, config);
                const result = res.data as APIResponseSuccess<ResData, ResMeta & ComonMeta>;
                    return {
                        ...result,
                        meta: {
                            ...result.meta,
                            status: res.status,
                            statusText: res.statusText
                        }
                    };

            } catch (err) {
                return this.handleAxiosError<ErrData, ErrMeta>(err);
            }
        }
    }


    call<Allowed extends HTTPMethods[]>(allowed?: Allowed): Allowed extends undefined
        ? Record<HTTPMethods, HTTPImpl>
        : Pick<Record<HTTPMethods, HTTPImpl>, Allowed[number]> {

        const handlers = {
            get: this.createHandler('get'),
            post: this.createHandler('post'),
            put: this.createHandler('put'),
            patch: this.createHandler('patch'),
            delete: this.createHandler('delete'),
            options: this.createHandler('options'),
            head: this.createHandler('head'),
        };

        if (!allowed) {
            return handlers as any;
        }


        const filtered = Object.fromEntries(
            Object.entries(handlers).filter(([method]) =>
                allowed.includes(method as HTTPMethods)
            )
        );

        return filtered as any;
    }
}


