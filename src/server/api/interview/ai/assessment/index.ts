import z from "zod";
import { AIInterviewZ } from "../../../../../_db/mongo/interviews/AIInterview/Description.js";
import { deleteReq, getReq, patchReq, postReq, putReq } from "../../../../../client/lib/axios/apiCall.js";
import { createResponseTemplate } from "../../../../lib/express/response/apiResponse.js";



// Custom Schemas
const partialZ = AIInterviewZ.partial()
const statusZ = AIInterviewZ.pick({ status: true })


export const AIInterviewClientZ = AIInterviewZ.omit({
    aiModel: true,
    allowedGroups: true,
    customInstructions: true,
    screening: true,
}).extend({
    rounds: AIInterviewZ.shape.rounds.element.omit({
        evaluationCriteria: true,
        status: true,
    }).array()
})



// Custom types
export type IAIInterview = z.infer<typeof AIInterviewZ>;
export type IAIInterviewClient = z.infer<typeof AIInterviewClientZ>



// Rules
export const AIInterview = {
    server: {


        // builder
        builderGetInterview: createResponseTemplate<IAIInterview | IAIInterview[]>(),
        builderCreateInterview: createResponseTemplate<IAIInterview, typeof AIInterviewZ>(AIInterviewZ),
        builderUpdateInterview: createResponseTemplate<IAIInterview, typeof partialZ>(partialZ),
        builderChangeStatus: createResponseTemplate<IAIInterview, typeof statusZ>(statusZ),
        builderDeleteInterview: createResponseTemplate<IAIInterview>(),


        // public
        publicGetInterview: createResponseTemplate<IAIInterviewClient | IAIInterviewClient[]>()

    },

    client: {
        builderGetInterviews: getReq<IAIInterview[]>,
        builderGetInterview: getReq<IAIInterview>,
        builderCreateInterview: postReq<IAIInterview, IAIInterview>,
        builderUpdateInterview: putReq<Partial<IAIInterview>, IAIInterview>,
        builderChangeStatus: patchReq<z.infer<typeof statusZ>, IAIInterview>,
        builderDeleteInterview: deleteReq<IAIInterview>,


        // public
        publicGetInterviews: getReq<IAIInterviewClient[]>,
        publicGetInterview: getReq<IAIInterviewClient>

    }
}

