import { CoreMessage } from '@mastra/core'
import { mastra } from '@/mastra'

export async function POST(req: Request) {
  const {
    message,
    threadId,
    resourceId,
  }: { message: CoreMessage | null; threadId: string; resourceId: string } =
    await req.json()

  if (!message || !message.content) {
    return new Response('Missing message content', { status: 400 })
  }

  const agent = mastra.getAgent('resumeExpertAgent')
  const stream = await agent.stream([message], {
    threadId,
    resourceId,
  })

  return stream.toDataStreamResponse()
}
