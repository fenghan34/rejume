import { createDataStreamResponse, streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

export async function POST(req: Request) {
  const { messages } = await req.json()

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: ollama('gemma3:12b'),
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
