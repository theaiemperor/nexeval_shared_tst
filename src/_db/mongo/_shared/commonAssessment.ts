import z from "zod";
import CommonCollection from "./commonCollection.js";


interface Description {
    title: string
    shortDesc: string
    longDesc: string
}


export function commonAssessment(desc: Description) {

    return CommonCollection.extend({

        builderId: z.string()
            .length(24, { message: "Invalid Builder ID" })
            .describe("Unique ID of the builder or system user who created this Assessment."),


        title: z.string()
            .max(100, { message: "Title is too long" })
            .describe(desc['title']),


        shortDescription: z.string()
            .max(400, { message: "Please provide a short description" })
            .describe(desc['shortDesc']),


        longDescription: z.string()
            .max(1500, { message: "Description is too much" })
            .describe(desc['longDesc']),


        estimatedTime: z.number()
            .optional()
            .describe("Approximate time (in minutes) expected for a candidate to complete the full assessment."),


        status: z.enum(["draft", "active", "stopped", "closed", "deleted"])
            .default("active")
            .describe("Lifecycle status of the assessment."),


        allowedGroups: z.array(z.string())
            .optional()
            .describe("Group IDs allowed to attempt this assessment (e.g., premium users).")
    })
}