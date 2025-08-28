import z from "zod";
import { AIInterviewLogZ } from "../../../../../_db/mongo/interviews/AIInterview/Logs.js";
import { getReq } from "../../../../../client/lib/axios/apiCall.js";
import { createResponseTemplate } from "../../../../lib/express/response/apiResponse.js";



export type IAIInterviewLog = z.infer<typeof AIInterviewLogZ>;



export const AIInterviewLogs = {
    server: {
        getLog: createResponseTemplate<IAIInterviewLog | IAIInterviewLog[]>(),
    },

    client: {
        getLog: getReq<IAIInterviewLog>,
        getLogs: getReq<IAIInterviewLog[]>
    }
}
