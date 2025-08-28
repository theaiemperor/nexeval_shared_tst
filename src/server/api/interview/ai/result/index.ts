import z from "zod";
import { AIInterviewResultZ } from "../../../../../_db/mongo/interviews/AIInterview/Result.js";
import { getReq, patchReq } from "../../../../../client/lib/axios/apiCall.js";
import { createResponseTemplate } from "../../../../lib/express/response/apiResponse.js";


// Schema
const statusZ = AIInterviewResultZ.pick({ status: true });


// types
export type IAIInterviewResult = z.infer<typeof AIInterviewResultZ>;
export type IAIInterviewResultClient = Omit<z.infer<typeof AIInterviewResultZ>, 'meta'>



export const AIInterviewResult = {
    server: {

        // admin
        adminGetResult: createResponseTemplate<IAIInterviewResult | IAIInterviewResult[]>(),

        // builder
        builderChangeStatus: createResponseTemplate<IAIInterviewResult, typeof statusZ>(statusZ),

        // public
        publicGetResult: createResponseTemplate<IAIInterviewResultClient>()

    },

    client: {

        adminGetResult: getReq<IAIInterviewResult>,
        adminGetResults: getReq<IAIInterviewResult[]>,

        builderChangeStatus: patchReq<z.infer<typeof statusZ>, IAIInterviewResult>,

        publicGetResult: getReq<IAIInterviewResultClient>
    }
}
