import type { InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const resumes = pgTable('resume', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export type ResumeModel = InferSelectModel<typeof resumes>

export const resumesRelations = relations(resumes, ({ many }) => ({
  chats: many(chats),
}))

export const chats = pgTable('chat', {
  id: uuid().primaryKey().defaultRandom(),
  resumeId: uuid()
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export type ChatModel = InferSelectModel<typeof chats>

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}))

export const messages = pgTable('message', {
  id: uuid().primaryKey().defaultRandom(),
  chatId: uuid()
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  content: text(),
  role: text().notNull(),
  parts: json().notNull(),
  attachments: json().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export type MessageModel = InferSelectModel<typeof messages>
