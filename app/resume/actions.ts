'use server'

import { UIMessage, generateText } from 'ai'
import { revalidatePath } from 'next/cache'
import { providers } from '@/lib/ai/providers'
import * as queries from '@/lib/db/queries'
import { ResumeModel } from '@/lib/db/schema'

export async function getResumeById(id: string) {
  return await queries.getResumeById(id)
}

export async function createNewResume(
  data: Pick<ResumeModel, 'name' | 'content'>,
) {
  await queries.createResume(data)
  revalidatePath('/resume')
}

export async function updateResume(
  id: string,
  data: Partial<Pick<ResumeModel, 'name' | 'content'>>,
) {
  await queries.updateResume(id, data)
  revalidatePath('/resume')
  revalidatePath(`/resume/${id}`, 'page')
}

export async function deleteResume(id: string) {
  await queries.deleteResume(id)
  revalidatePath('/resume')
}

export async function getMessagesByChatId(id: string) {
  return await queries.getMessagesByChatId(id)
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage
}) {
  const { text: title } = await generateText({
    model: providers.openrouter('meta-llama/llama-4-maverick:free'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return title
}

export async function importFromPDF(file: File, exampleResume: string) {
  const { text } = await generateText({
    model: providers.openrouter('meta-llama/llama-4-maverick:free'),
    system: `You are a helpful assistant that extracts and structures all relevant information including personal details, work experience, education, skills, and any other sections present from the OCR of user's resume PDF.
      - you should return the information in Markdown format
      - you should return the information in the same language as the resume
      - you should format the information clearly in the same format as the example below

      Example output:
      ${exampleResume}
      `,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            filename: file.name,
            mimeType: 'application/pdf',
            data: await file.bytes(),
          },
        ],
      },
    ],
  })

  return text
}
