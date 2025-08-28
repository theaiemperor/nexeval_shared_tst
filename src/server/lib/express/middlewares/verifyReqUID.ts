import { RequestHandler } from "express";
import { verifyMongoUID } from "../../mongoose/verfiyMongoUID.js";
import { createResponse } from "../response/apiResponse.js";


export const verifyMongoUIDReq = (idName: string = "id"): RequestHandler => {
    return createResponse((req, res, next) => {

        const id = req.params[idName];

        if (!id) {
            return res.status(404)
                .json({ success: false, data: {}, message: "Please provide UID." })
        }

        const verify = verifyMongoUID(id);

        if (!verify) {
            return res.status(404).json({
                success: false,
                data: {},
                message: "Please provide valid UID."
            })
        }

        return next()
    })

}
