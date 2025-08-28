import { RequestHandler } from "express";
import _ from "lodash";
import { z, ZodError, ZodType } from "zod/v4";
import { IObj } from "../../../types/common.js";
import { ResponseType } from "../express/response/apiResponseTypes.js";


export function zodSchemaValidator(schema: ZodType): RequestHandler {


    return (req, res: ResponseType<any, IObj, any, any>, next) => {
        try {
            const validObject = schema instanceof z.ZodObject && typeof (req.body) === "object";
            const validArray = schema instanceof z.ZodArray && Array.isArray(req.body);

            if (validArray) {
                req.body.forEach((item: any) => {
                    (schema as z.ZodArray<any>).element.parse(item);
                });

            } else if (validObject) {
                schema.parse(req.body);
                req.body = _.pick(req.body, Object.keys(schema.shape));

            } else {
                res.status(415).json({
                    success: false,
                    message: "Invalid payload type",
                    data: {},
                })
            }

            next()

        } catch (error) {
            if (error instanceof ZodError) {

                const data = Object.fromEntries(
                    Object.entries(z.flattenError(error).fieldErrors).map(([field, messages]) => [
                        field,
                        (messages as string[])?.[0] || "Invalid value",
                    ])
                );


                res.status(422).json({
                    success: false,
                    message: 'Invalid data found',
                    data
                });


            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    data: {},
                    meta: { origin: 'Error occurre during zod schema validation.' }
                });
            }
        }
    }
}

