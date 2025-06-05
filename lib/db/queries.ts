import 'server-only'
import type { ChatModel, MessageModel, ResumeModel } from './schema'
import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { z } from 'zod'
import { chats, messages, resumes } from './schema'

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle({
  client,
  casing: 'snake_case',
})

export const getResumeList = async (userId: string) => {
  return await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt))
}

export const createResume = async (
  data: Pick<ResumeModel, 'title' | 'content' | 'userId'>,
) => {
  return await db.insert(resumes).values(data)
}

export const getResumeById = async (id: string) => {
  const { success } = z.string().uuid().safeParse(id)
  if (!success) return null
  const data = await db.select().from(resumes).where(eq(resumes.id, id))
  if (data.length === 0) return null
  return data[0]
}

export const updateResume = async (
  id: string,
  data: Partial<Pick<ResumeModel, 'title' | 'content'>>,
) => {
  return await db
    .update(resumes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resumes.id, id))
}

export const deleteResume = async (id: string) => {
  return await db.delete(resumes).where(eq(resumes.id, id))
}

export const saveChat = async (
  data: Pick<ChatModel, 'id' | 'title' | 'resumeId'>,
) => {
  return await db.insert(chats).values(data)
}

export const getChatById = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.id, id))
  if (data.length === 0) return null
  return data[0]
}

export const getChatsByResumeId = async (id: string) => {
  return await db.select().from(chats).where(eq(chats.resumeId, id))
}

export const saveMessage = async (data: Omit<MessageModel, 'createdAt'>) => {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.id, data.id))

  if (result.length > 0) {
    return await db.update(messages).set(data).where(eq(messages.id, data.id))
  }

  return await db.insert(messages).values(data).returning()
}

export const getMessagesByChatId = async (id: string) => {
  return await db.select().from(messages).where(eq(messages.chatId, id))
}
