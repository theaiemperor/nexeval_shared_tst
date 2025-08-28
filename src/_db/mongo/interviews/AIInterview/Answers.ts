import z from "zod";



const QuestionSchema = z.object({
    _id: z.string()
        .length(24)
        .describe("Unique ID for this question instance (helps link answers later)."),

    order: z.number().min(1)
        .describe("Order of the question within the round."),

    question: z.string()
        .describe("The actual text of the question presented to the candidate."),

    reason: z.array(z.string())
        .describe("Why this question was chosen (e.g., 'test JavaScript skills', 'check leadership under pressure')."),

    ref: z.array(z.string())
        .describe("References behind choosing this question (e.g., job description skill, resume entry, previous round answer)."),

    expectedAnswer: z.string()
        .describe("What an ideal or strong answer would look like, written in natural language (not a strict regex)."),

    difficulty: z.enum(["easy", "medium", "hard"])
        .optional()
        .describe("Relative difficulty level of the question."),

    skillTags: z.array(z.string())
        .optional()
        .describe("Skills/competencies this question maps to (e.g., 'React', 'Negotiation', 'Safety Awareness')."),

    evaluationCriteria: z.array(z.string())
        .optional()
        .describe("What aspects the evaluator/AI should look for in the answer (clarity, accuracy, creativity, confidence)."),

    followUP: z.string()
        .length(24)
        .optional()
        .describe('Whether this is a follow up question of earlier question or not.')
});



const AnswerSchema = z.object({
    questionId: z.string()
        .length(24)
        .describe("Reference to the Question._id this answer belongs to."),

    responseText: z.string()
        .optional()
        .describe("Candidate's text answer."),

    score: z.number()
        .min(1)
        .max(100)
        .describe('Answer score (1-100) for the candidate in this question. Higher means better.'),

    summary: z.string()
        .describe("AI's summary/explanation of candidate's answer."),

    improvements: z.array(z.string()).optional()
        .describe("AI's suggestions for improving the answer."),

    duration: z.number()
        .optional()
        .describe("Time taken (in seconds) to answer this question."),

    flags: z.array(z.enum(["irrelevant", "cheating", "unclear", "exceptional"]))
        .optional()
        .describe("Optional labels to flag unusual or noteworthy answers (useful in training future models).")
});




export const AIInterviewAnswersZ = z.object({
    interviewId: z.string()
        .length(24)
        .describe("Reference to the interview this response belongs to."),

    candidateId: z.string()
        .length(24)
        .describe("Candidate's unique identifier."),


    questions: z.record(
        z.string()
            .length(24)
            .describe("Round ID from which each question belongs"),

        z.array(QuestionSchema)
    ).default({}),

    screeningQuestions: z.array(QuestionSchema).default([]),

    screeningAnswers: z.array(AnswerSchema).default([]),


    answers: z.record(
        z.string()
            .length(24)
            .describe("Round ID from which each answer belongs"),

        z.array(AnswerSchema)
    ).default({}),


    status: z.enum([

        // Lifecycle
        "pending",            // Created, not started
        "in_progress",        // Started but not finished
        "completed",          // Candidate finished all

        // Explicit exit
        "stopped_irresponsible", // Quit midway (rage quit)
        "stopped_builder",
        "stopped_admin",


        // Implicit exit
        "failed_screening",          // Failed in screening round
        "failed_cheating",           // Found cheating signs
        "failed_irrelevant",         // Continuous irrelevant answers
        "failed_expired",            // Running interview validation expired
        "failed_error",              // Failed due to technical errors

    ]),

    reason: z.string()
        .optional()
        .describe("Additional reason/context for non-normal closures (e.g., 'idle_timeout', 'network_error', 'cheating')."),
});