import { z } from 'zod'

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    createdAt: z.coerce.date(),
    role: z.enum(['user', 'assistant']),
    content: z.string().min(0).max(3000),
    parts: z.array(z.any()),
    experimental_attachments: z.array(z.any()).optional(),
  }),
})

export type PostRequestBody = z.infer<typeof postRequestBodySchema>
