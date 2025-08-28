import z from "zod";
import { getReq, postReq, putReq } from "../../../../../client/lib/axios/apiCall.js";
import { createResponseTemplate } from "../../../../lib/express/response/apiResponse.js";
import { AIInterviewResponse_AI, AIInterviewResponse_User, AIInterviewToken } from "./schema.js";


type AIResponse = z.infer<typeof AIInterviewResponse_AI>;
type UserResponse = z.infer<typeof AIInterviewResponse_User>;


type Token = z.infer<typeof AIInterviewToken>;



export const AIInterviewLive = {
    server: {

        startInterview: createResponseTemplate<Token>(),
        startRound: createResponseTemplate<AIResponse, typeof AIInterviewResponse_User>(AIInterviewResponse_User),
        continueChat: createResponseTemplate<AIResponse, typeof AIInterviewResponse_User>(AIInterviewResponse_User),
    },

    client: {
        startInterview: getReq<AIResponse>,
        startRound: postReq<UserResponse, AIResponse>,
        continueChat: putReq<UserResponse, AIResponse>,
    }
}
