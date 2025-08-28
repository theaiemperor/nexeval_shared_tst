import z from "zod";


export const AIInterviewLogZ = z.object({

    interviewID: z.string()
        .describe("The interview this log belongs to."),

    actor: z.object({
        actorID: z.string().describe("ID of the user/admin/bot who performed the action"),
        role: z.enum(["system", "admin", "recruiter", "ai_assistant"])
            .describe("Who triggered this change"),
    }),

    action: z.object({
        operation: z.enum(['add', 'update', 'delete', 'append', 'pop', 'obj']),
        field: z.string(),
        prevValue: z.any()
    }),

    roundId: z.string()
        .length(24)
        .optional()
        .describe("Round id if changes were made to round"),

    justification: z.string()
        .optional()
        .describe("Reason/explanation for this change (if provided by admin or AI)"),

    notes: z.string()
        .optional()
        .describe("Any extra notes or contextual info for this log entry")

});