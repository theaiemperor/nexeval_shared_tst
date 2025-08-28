import z from "zod";
import { commonAssessment } from "../../_shared/commonAssessment.js";


// Each round in the interview (can be multiple)
const RoundSchema = z.object({
    _id: z.string()
        .describe("Unique round ID."),

    order: z.number()
        .min(1, { message: "Order cannot be less than 1" })
        .describe("Order number of this round in the interview process."),

    title: z.string()
        .max(200, { message: "Round title is too long" })
        .describe("Name of the round, e.g., 'Technical Coding Test', 'Behavioral Interview', 'Practical Task'."),

    description: z.string()
        .describe(
            "A detailed recruiter note about this round. This should include:\n" +
            "- What this round is designed to test (skills, mindset, knowledge).\n" +
            "- Suggested evaluation criteria (e.g., problem solving, leadership).\n" +
            "- Example questions that could be asked.\n" +
            "- The reason why these questions matter.\n" +
            "If recruiter provides only a short text, AI must expand it into a full useful description."
        ),

    // format: z.enum(["ai-questionnaire", "live-ai", "live-human", "assignment", "group-task"])
    //     .default("ai-questionnaire")
    //     .describe("Format of the round: AI text-based questions, live AI video, human-led, or task submission."),

    timeLimit: z.number()
        .optional()
        .describe("Time limit (in minutes) for this round."),

    evaluationCriteria: z.array(z.string())
        .optional()
        .describe("Key criteria for evaluating this round, e.g., 'problem solving', 'teamwork', 'safety awareness'."),

    status: z.enum(["active", "removed", "stopped"])
        .default("active")
        .describe("Current status of the round.")
});




const common = commonAssessment({
    title: "Short title of the interview, e.g., 'Frontend Engineer Screening' or 'Warehouse Supervisor Hiring Test'.",
    shortDesc: "Brief description visible to candidates, summarizing the interview purpose and role expectations.",
    longDesc: "Detailed role description, responsibilities, and context. This helps AI generate contextual questions."
})




export const AIInterviewZ = z.object({

    ...common.shape,


    roleType: z.enum([
        "technical", "non-technical", "creative", "administrative", "labor", "sales", "marketing", "management", "other"
    ])
        .default("other")
        .describe("Broad classification of the job role. Helps AI decide the tone and complexity of questions."),

    industry: z.string()
        .max(200)
        .optional()
        .describe("Optional: Industry or domain for this role, e.g., 'Healthcare', 'Construction', 'Software', 'Retail'."),

    seniorityLevel: z.enum(["intern", "junior", "mid", "senior", "lead", "manager", "executive"])
        .optional()
        .describe("Seniority level of the role. Influences the difficulty and style of AI-generated questions."),


    screening: z.string()
        .describe(
            "This is the filtering guide for AI.\n" +
            "Recruiter defines what kind of candidates should be shortlisted or rejected.\n" +
            "AI must use recruiter notes + candidate onboarding data (skills, availability, location, etc.) to:\n" +
            "- Match candidate profiles with job expectations.\n" +
            "- Filter out irrelevant candidates early (e.g., wrong skills, unavailable shift, language mismatch).\n" +
            "- Save recruiter time by screening only the right people.\n" +
            "If recruiter provides only a small hint (like 'Need forklift license'), AI should expand into full screening logic."
        ),


    aiModel: z.string()
        .max(300, { message: "Provide a short name of the model" })
        .optional()
        .describe("AI model to be used for question generation, e.g., 'gpt-5', 'llama3'. If not set, system chooses default."),


    skills: z.array(z.string())
        .optional()
        .describe("List of skills relevant for this role, e.g., ['JavaScript', 'Negotiation', 'Machine Operation']."),

    languagesRequired: z.array(z.string())
        .optional()
        .describe("Languages candidate must know, e.g., ['English', 'Hindi']."),

    locationType: z.enum(["remote", "onsite", "hybrid"])
        .default("onsite")
        .describe("Nature of the job role in terms of work location."),

        
    customInstructions: z.string()
        .optional()
        .describe("Any special recruiter instructions for AI to consider while generating questions, e.g., 'Focus on leadership skills'."),


    rounds: z.array(RoundSchema)
        .min(1)
        .describe(
            "List of interview rounds. Each round must have:\n" +
            "- Title\n" +
            "- Rich description (with 'what to test', 'why to test', and example questions)\n" +
            "If recruiter provides only a small note, AI must generate a full round design."
        )
});