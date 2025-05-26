import { createDataStreamResponse, streamText } from 'ai'
import { providers } from '@/lib/ai/providers'

export async function POST(req: Request) {
  const { messages } = await req.json()

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: providers.openrouter('meta-llama/llama-4-maverick:free'),
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
