import { Request, RequestHandler, Response } from "express";
import z, { ZodType } from "zod/v4";
import { IObj } from "../../../../types/common.js";


export interface APIResponseSuccess<Res, Meta extends object> {
    success: true;
    message: string;
    data: Res;
    meta: Meta;
}


export interface APIResponseError<Err, Meta extends object> {
    success: false;
    message: string;
    data: Err;
    meta: Meta;
}




export type APIResponse<
    Res = IObj,
    Err = string,
    ResMeta extends object = IObj,
    ErrMeta extends object = IObj
> = APIResponseSuccess<Res, ResMeta> | APIResponseError<Err, ErrMeta>


// Utility type for handler response
export type ResponseType<Res, Err, ResMeta extends object, ResErr extends object> = Response<
    | (Partial<APIResponse<Res, Err, ResMeta, ResErr>> & { data: Res; success?: true })
    | (Partial<APIResponse<Res, Err>> & { data: Err; success: false })
>;



// Typed handler
export type TypedRequestHandler<
    Res = IObj,
    Err = IObj,
    ResMeta extends object = IObj,
    ErrMeta extends object = IObj,
    ReqType extends Request = Request
> = (
    req: ReqType,
    res: ResponseType<Res, Err, ResMeta, ErrMeta>,
    next: Function
) => void | Promise<void>;

export type SchemaType<Schema> = Request<Record<string, string>, any, z.infer<Schema>, Record<string, any>>





export type ResponseTemplateWithoutSchema<
    Res = IObj,
    Err = IObj,
    ResMeta extends object = IObj,
    ErrMeta extends object = IObj
> = (
    handler: TypedRequestHandler<
        Res,
        Err,
        ResMeta,
        ErrMeta,
        Request
    >
) => RequestHandler;

export type ResponseTemplateWithSchema<
  Res = IObj,
  Schema extends ZodType = ZodType,
  Err = IObj,
  ResMeta extends object = IObj,
  ErrMeta extends object = IObj
> = (
  handler: TypedRequestHandler<
    Res,
    Err,
    ResMeta,
    ErrMeta,
    SchemaType<Schema>
  >
) => RequestHandler;


