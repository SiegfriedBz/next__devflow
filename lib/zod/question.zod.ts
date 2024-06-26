import { z } from "zod"

const mutateQuestionSchema = z.object({
  title: z.string().min(5).max(130),
  content: z.string().min(20),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "Must have at least 1 tag" })
    .max(3, { message: "Must have 3 tags max" }),
})

type TMutateQuestionInput = z.infer<typeof mutateQuestionSchema>
export { mutateQuestionSchema, type TMutateQuestionInput }
