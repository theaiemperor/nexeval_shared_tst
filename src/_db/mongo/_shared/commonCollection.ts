import z from "zod";

const CommonCollection = z.object({
    tags: z.array(z.string()),

    createdAt: z.date()
        .default(() => new Date()),

    updatedAt: z.date()
        .default(() => new Date())
})

export default CommonCollection;