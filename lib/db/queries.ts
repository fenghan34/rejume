import type { ChatSchema, MessageSchema, ResumeSchema } from './schema'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { chats, messages, resumes } from './schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle({
  client,
  casing: 'snake_case',
})

export const getResumeList = async () => {
  try {
    return await db.select().from(resumes)
  } catch (error) {
    console.log('error', error)
    return []
  }
}

export const createResume = async (
  data: Pick<ResumeSchema, 'name' | 'content'>,
) => {
  return await db.insert(resumes).values(data)
}

export const getResumeById = async (id: string) => {
  const data = await db.select().from(resumes).where(eq(resumes.id, id))
  if (data.length === 0) return null
  return data[0]
}

export const updateResume = async (
  id: string,
  data: Partial<Pick<ResumeSchema, 'name' | 'content'>>,
) => {
  return await db.update(resumes).set(data).where(eq(resumes.id, id))
}

export const deleteResume = async (id: string) => {
  return await db.delete(resumes).where(eq(resumes.id, id))
}

export const saveChat = async (
  data: Pick<ChatSchema, 'id' | 'title' | 'resumeId'>,
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

export const saveMessage = async (data: Omit<MessageSchema, 'createdAt'>) => {
  return await db.insert(messages).values(data).returning()
}

export const getMessagesByChatId = async (id: string) => {
  return await db.select().from(messages).where(eq(messages.chatId, id))
}
