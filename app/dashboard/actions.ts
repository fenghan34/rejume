'use server'

import { generateResumeFromPDF } from '@/lib/ai/utils'
import { verifySession } from '@/lib/auth/server'
import * as queries from '@/lib/db/queries'
import { ResumeModel } from '@/lib/db/schema'

export async function getResumeList() {
  const session = await verifySession()
  return await queries.getResumeList(session!.user.id)
}

export async function getResumeById(id: string) {
  await verifySession()
  return await queries.getResumeById(id)
}

export async function createResume(
  data: Pick<ResumeModel, 'title' | 'content'>,
) {
  const session = await verifySession()
  await queries.createResume({ ...data, userId: session.user.id })
}

export async function updateResume(
  id: string,
  data: Partial<Pick<ResumeModel, 'title' | 'content' | 'isPublic'>>,
) {
  await verifySession()
  await queries.updateResume(id, data)
}

export async function deleteResume(id: string) {
  await queries.deleteResume(id)
}

export async function getChatsByResumeId(resumeId: string) {
  await verifySession()
  return await queries.getChatsByResumeId(resumeId)
}

export async function getChatById(id: string) {
  await verifySession()
  const chat = await queries.getChatById(id)

  if (!chat) return

  const messages = await getMessagesByChatId(chat.id)

  return {
    ...chat,
    messages,
  }
}

export async function getMessagesByChatId(id: string) {
  await verifySession()
  return await queries.getMessagesByChatId(id)
}

export async function deleteChat(id: string) {
  await verifySession()
  await queries.deleteChat(id)
}

export async function importResumeFromPDF(file: File, exampleResume: string) {
  await verifySession()
  return generateResumeFromPDF(file, exampleResume)
}
