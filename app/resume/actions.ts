'use server'

import { UIMessage, generateText } from 'ai'
import { revalidatePath } from 'next/cache'
import { model } from '@/lib/ai/model'
import * as queries from '@/lib/db/queries'
import { ResumeSchema } from '@/lib/db/schema'

export async function getResumeById(id: string) {
  return await queries.getResumeById(id)
}

export async function createNewResume(
  data: Pick<ResumeSchema, 'name' | 'content'>,
) {
  await queries.createResume(data)
  revalidatePath('/resume')
}

export async function updateResume(
  id: string,
  data: Partial<Pick<ResumeSchema, 'name' | 'content'>>,
) {
  await queries.updateResume(id, data)
  revalidatePath(`/resume/${id}`)
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
    model,
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return title
}
