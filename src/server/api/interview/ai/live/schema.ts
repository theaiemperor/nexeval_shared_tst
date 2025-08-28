import z from "zod"
import { AIInterviewAnswersZ } from "../../../../../_db/mongo/interviews/AIInterview/Answers.js"


export const AIInterviewToken = z.object({
    interviewID: z.string(),
    answerID: z.string(),
    roundID: z.string(),
    allRounds: z.array(z.string()),
    flags: z.object({
        irrelevantScore: z.number(),
        cheatingScore: z.number(),
        unclearScore: z.number()
    }),
    status: z.enum([...AIInterviewAnswersZ.shape.status.options, 'round_finished'])
})


export const AIInterviewResponse_User = z.object({
    token: z.string(),
    user: z.string()
})


export const AIInterviewResponse_AI = AIInterviewToken.extend({
    token: z.string(),
    ai: z.string()
})
