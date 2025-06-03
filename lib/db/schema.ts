import type { InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import {
  boolean,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const resumes = pgTable('resume', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
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

export const user = pgTable('user', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  image: text(),
  createdAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const verification = pgTable('verification', {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
})
