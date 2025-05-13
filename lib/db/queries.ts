import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {
  chats,
  type ChatSchema,
  messages,
  MessageSchema,
  resumes,
  type ResumeSchema,
} from './schema'

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

export const createChat = async (
  data: Pick<ChatSchema, 'title' | 'resumeId'>,
) => {
  return await db.insert(chats).values(data).returning()
}

export const getChat = async (id: string) => {
  return await db.select().from(chats).where(eq(chats.id, id))
}

export const getChatsByResumeId = async (resumeId: string) => {
  return await db.select().from(chats).where(eq(chats.resumeId, resumeId))
}

export const createMessage = async (
  data: Pick<MessageSchema, 'content' | 'role' | 'chatId'>,
) => {
  return await db.insert(messages).values(data).returning()
}

export const getMessagesByChatId = async (chatId: string) => {
  return await db.select().from(messages).where(eq(messages.chatId, chatId))
}
