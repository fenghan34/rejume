import {
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  Message,
  streamText,
} from 'ai'
import { NextRequest } from 'next/server'
import { generateTitleFromUserMessage } from '@/app/dashboard/actions'
import { systemPrompt } from '@/lib/ai/prompt'
import { providers } from '@/lib/ai/providers'
import { withAuth } from '@/lib/auth/server'
import {
  getChatById,
  getMessagesByChatId,
  getResumeById,
  saveChat,
  saveMessage,
} from '@/lib/db/queries'
import { generateUUID } from '@/lib/utils'
import { PostRequestBody, postRequestBodySchema } from './schema'

export const maxDuration = 30

async function secretPOST(req: NextRequest) {
  let requestBody: PostRequestBody

  try {
    const json = await req.json()
    requestBody = postRequestBodySchema.parse(json)
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
    })
  }

  const { id, resumeId, message } = requestBody

  const resume = await getResumeById(resumeId)
  if (!resume) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
    })
  }

  const chat = await getChatById(id)
  if (!chat) {
    await saveChat({
      id,
      title: await generateTitleFromUserMessage({ message }),
      resumeId,
    })
  }

  await saveMessage({
    id: message.id,
    chatId: id,
    role: 'user',
    content: message.content,
    parts: message.parts,
    attachments: message.experimental_attachments ?? [],
  })

  const previousMessages = await getMessagesByChatId(id)
  const messages = appendClientMessage({
    messages: previousMessages as Message[],
    message,
  })

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: providers.openrouter('openai/gpt-4o-mini'),
        system: systemPrompt(resume.content),
        messages,
        abortSignal: req.signal,
        experimental_generateMessageId: generateUUID,
        onFinish: async ({ response }) => {
          const [, assistantMessage] = appendResponseMessages({
            messages: [message],
            responseMessages: response.messages,
          })
          await saveMessage({
            id: assistantMessage.id,
            chatId: id,
            role: 'assistant',
            content: assistantMessage.content,
            parts: assistantMessage.parts,
            attachments: assistantMessage.experimental_attachments ?? [],
          })
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      console.error(error)
      return error instanceof Error ? error.message : String(error)
    },
  })
}

export const POST = withAuth(secretPOST)
