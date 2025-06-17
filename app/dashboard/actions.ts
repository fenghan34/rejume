'use server'

import { UIMessage, generateText } from 'ai'
import { revalidatePath } from 'next/cache'
import { providers } from '@/lib/ai/providers'
import { verifySession } from '@/lib/auth/server'
import * as queries from '@/lib/db/queries'
import { ResumeModel } from '@/lib/db/schema'

export async function getResumeById(id: string) {
  await verifySession()
  return await queries.getResumeById(id)
}

export async function createResume(
  data: Pick<ResumeModel, 'title' | 'content'>,
) {
  const session = await verifySession()
  await queries.createResume({ ...data, userId: session.user.id })

  revalidatePath('/dashboard')
}

export async function updateResume(
  id: string,
  data: Partial<Pick<ResumeModel, 'title' | 'content'>>,
) {
  await verifySession()
  await queries.updateResume(id, data)
  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/${id}`, 'page')
}

export async function deleteResume(id: string) {
  await verifySession()
  await queries.deleteResume(id)
  revalidatePath('/dashboard')
}

export async function getMessagesByChatId(id: string) {
  await verifySession()
  return await queries.getMessagesByChatId(id)
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage
}) {
  await verifySession()
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

export async function deleteChat(id: string) {
  await verifySession()
  await queries.deleteChat(id)
}

export async function importFromPDF(file: File, exampleResume: string) {
  await verifySession()
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
