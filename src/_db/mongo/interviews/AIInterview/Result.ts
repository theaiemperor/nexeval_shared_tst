import z from "zod";
import CommonCollection from "../../_shared/commonCollection.js";

const AIStatement = z.object({
    statement: z.string().describe("The exact candidate-related statement or observation generated from the interview chat."),

    confidence: z.number()
        .min(1)
        .max(100)
        .describe("Confidence level (1-100) that this statement is correct and relevant to the candidate."),

    reason: z.array(
        z.string().max(200)
    ).describe("A list (short phrases) of supporting reasons for why this statement was generated. Each reason must be concise and under 200 characters."),

    questionIDs: z.array(z.string())
        .describe("Array of question IDs from which this statement was derived or supported.")
});

function getSchema(isInterview?: boolean) {
    const view = isInterview ? "Interview (all rounds combined)" : "Single round only";

    return z.object({
        score: z.number()
            .min(1)
            .max(100)
            .describe(`Overall performance score (1-100) for the candidate in this ${view}. Higher means better.`),

        fitmentScore: z.number()
            .min(1)
            .max(100)
            .describe(`Fitment score (1-100) reflecting how well the candidate aligns with the team, culture, and role beyond technical answers in this ${view}.`),

        summary: z.string()
            .max(1000, { error: "Maximum length exceeded for summary" })
            .describe(`Concise narrative summary (≤1000 chars) highlighting key outcomes of the ${view}. Must avoid repeating analysis verbatim.`),

        skills: z.record(
            z.string(),
            z.object({
                score: z.number().min(1).max(100)
                    .describe("Skill score (1-100) for the candidate in this area."),
                weight: z.number().min(0).max(1)
                    .describe("Relative importance/weight (0-1) of this skill for evaluation.")
            })
        ).describe(`Key skills observed in the candidate during this ${view}, each with a numeric score and relative weight.`),

        analysis: z.string()
            .max(3000, { error: "Maximum length exceeded for analysis" })
            .describe(`Detailed explanation (≤3000 chars) of how the candidate answered questions, covering strengths, weaknesses, reasoning depth, and behavior in this ${view}.`),

        pros: z.array(AIStatement)
            .min(3)
            .max(10)
            .describe(`List of 3-10 key strengths identified from candidate answers in this ${view}. Each item must include statement, confidence, reasons, and linked questions.`),

        cons: z.array(AIStatement)
            .min(3)
            .max(10)
            .describe(`List of 3-10 weaknesses or concerns observed in this ${view}. Each must include statement, confidence, reasons, and linked questions.`),

        riskFactors: z.array(AIStatement)
            .describe(`Potential risks or red flags (e.g., shallow answers, inconsistency, overconfidence) observed in this ${view}.`),

        softSkills: z.array(AIStatement)
            .describe(`Soft skills inferred (e.g., communication, clarity, adaptability, confidence) from the candidate's responses in this ${view}.`),

        trend: z.enum(["improving", "declining", "stable"])
            .describe(`Performance trajectory across the ${view}. 
- "improving": candidate shows growth across answers/rounds. 
- "declining": performance worsens. 
- "stable": consistent performance with no major shift.`),

        improvements: z.array(z.string())
            .describe(`Specific actionable improvements for the candidate derived from this ${view}. Each should be a short, clear suggestion.`),

        nextStep: z.object({
            questions: z.array(z.string())
                .describe("Follow-up interview questions to ask the candidate next."),
            assignments: z.array(z.string())
                .describe("Practical assignments/exercises recommended for further evaluation.")
        }).describe("Next steps recommended for the candidate after this evaluation."),

        timeTaken: z.number()
            .describe("Total time (in seconds) the candidate took to complete this interview/round.")
    });
}

export const AIInterviewResultZ = CommonCollection.extend({

    interviewID: z.string()
        .length(24, { message: "Invalid Interview ID" })
        .describe("Unique identifier for this interview."),

    candidateID: z.string()
        .length(24, { message: "Invalid Builder ID" })
        .describe("Unique identifier of the candidate being evaluated."),

    answersID: z.string()
        .length(24, { message: "Invalid Builder ID" })
        .describe("Unique identifier for the candidate's answers."),

    verdict: z.enum(["strong_hire", "hire", "neutral", "no_hire"])
        .describe("Final verdict: 'strong_hire' = excellent fit, 'hire' = good fit, 'neutral' = inconclusive, 'no_hire' = not suitable."),

    consistencyScore: z.number()
        .min(1).max(100)
        .describe("Consistency score (1-100) measuring how coherent and aligned candidate's answers are across all rounds."),

    overall: getSchema(true)
        .describe("Aggregate evaluation combining all rounds of the interview."),

    jobMatch: z.array(
        z.object(
            {
                roleName: z.string()
                    .describe("Alternative role or position the candidate may be suitable for."),
                score: z.number()
                    .min(1)
                    .max(100)
                    .describe("Suitability score (1-100) for the alternative role.")
            }
        ))
        .default([])
        .describe("If the candidate is better suited for other roles, list those alternatives with suitability scores."),

    rounds: z.array(getSchema(false))
        .describe("List of individual round-wise evaluations, each following the same schema."),

    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),

    meta: z.object({
        modelName: z.string().describe("Name of the AI model used for this evaluation."),
        modelVersion: z.string().describe("Version number of the AI model used.")
    }).describe("Metadata about the AI model generating this evaluation.")

});
