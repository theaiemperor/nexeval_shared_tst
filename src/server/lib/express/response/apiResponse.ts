import { Request, RequestHandler } from "express";
import { ZodType } from "zod/v4";
import { ResponseTemplateWithoutSchema, ResponseTemplateWithSchema, SchemaType, TypedRequestHandler } from "./apiResponseTypes.js";
import { zodSchemaValidator } from "../../zod/zodValidator.js";
import { IObj } from "../../../../types/common.js";

function wrapResponse<Res, Err, ResMeta extends object, ErrMeta extends object, Schema extends ZodType | undefined>(
    handler: TypedRequestHandler<Res, Err, ResMeta, ErrMeta, Schema extends ZodType ? SchemaType<Schema> : Request>,
    schema?: Schema): RequestHandler {

    return (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            const defaultResponse = {
                message: "",
                meta: {},
                success: true,
            };
            return originalJson({ ...defaultResponse, ...body });
        };

        if (schema) {
            return zodSchemaValidator(schema)(req, res, (err?: any) => {
                if (err) return next(err);
                handler(req as any, res as any, next);
            });
        }

        return handler(req as any, res as any, next);
    };
}



export function createResponseTemplate<Res = IObj, Schema extends ZodType = ZodType, Err = IObj, ResMeta extends object = IObj, ErrMeta extends object = IObj>(schema: Schema): ResponseTemplateWithSchema<Res, Schema, Err, ResMeta, ErrMeta>;
export function createResponseTemplate<Res = IObj, Schema = undefined, Err = IObj, ResMeta extends object = IObj, ErrMeta extends object = IObj>(): ResponseTemplateWithoutSchema<Res, Err, ResMeta, ErrMeta>;

export function createResponseTemplate<
    Res = IObj,
    Schema extends ZodType | undefined = undefined,
    Err = IObj,
    ResMeta extends object = IObj,
    ErrMeta extends object = IObj,
>(schema?: Schema) {
    return (handler: TypedRequestHandler<Res, Err, ResMeta, ErrMeta, Schema extends ZodType ? SchemaType<Schema> : Request>): RequestHandler =>
        wrapResponse(handler, schema);
}



export function createResponse<
    Res = IObj,
    Schema extends ZodType | undefined = undefined,
    Err = IObj,
    ResMeta extends object = IObj,
    ErrMeta extends object = IObj,
>(
    handler: TypedRequestHandler<
        Res,
        Err,
        ResMeta,
        ErrMeta,
        Schema extends ZodType ? SchemaType<Schema> : Request
    >,
    schema?: Schema
): RequestHandler {
    return wrapResponse(handler, schema);
}
