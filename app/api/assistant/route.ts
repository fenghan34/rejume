import { createDataStreamResponse, streamText } from 'ai'
import { model } from '@/lib/ai/model'

export async function POST(req: Request) {
  const { messages } = await req.json()

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model,
        messages,
        abortSignal: req.signal,
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      return error instanceof Error ? error.message : String(error)
    },
  })
}
