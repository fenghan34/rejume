import {
  appendClientMessage,
  appendResponseMessages,
  Message,
  streamText,
} from 'ai'
import { generateTitleFromUserMessage } from '@/app/resume/actions'
import { model } from '@/lib/ai/model'
import { systemPrompt } from '@/lib/ai/prompt'
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessage,
} from '@/lib/db/queries'
import { generateUUID } from '@/lib/utils'
import { PostRequestBody, postRequestBodySchema } from './schema'

export async function POST(req: Request) {
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

  const chat = await getChatById(id)
  if (!chat) {
    const title = await generateTitleFromUserMessage({ message })
    await saveChat({
      id,
      title,
      resumeId,
    })
  }

  const previousMessages = await getMessagesByChatId(id)
  const messages = appendClientMessage({
    messages: previousMessages as Message[],
    message,
  })

  await saveMessage({
    id: message.id,
    chatId: id,
    role: 'user',
    content: message.content,
    parts: message.parts,
    attachments: message.experimental_attachments ?? [],
  })

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
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
    onError(error) {
      console.log(error)
    },
  })

  return result.toDataStreamResponse()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), {
      status: 400,
    })
  }

  const messages = await getMessagesByChatId(id)
  return new Response(JSON.stringify(messages), { status: 200 })
}
