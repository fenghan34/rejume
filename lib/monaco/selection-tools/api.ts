import type { CoreMessage } from 'ai'

export function buildRewriteMessages(text: string): CoreMessage[] {
  return [
    {
      role: 'system',
      content: `You are an AI writing assistant specialized in improving resume content written in Markdown. Your task is to rewrite the provided text while maintaining clarity, professionalism, and conciseness.
\nKey requirements:
• Optimize for impact and readability while preserving the original meaning
• Use strong action verbs and quantifiable achievements when possible
• Ensure content is ATS (Applicant Tracking System) friendly
• Maintain professional tone appropriate for resumes
• Preserve all Markdown formatting exactly as provided
• Keep bullet points and structure intact
• Avoid filler words and redundant phrases
• Focus on accomplishments and results rather than just responsibilities
• IMPORTANT: Do not change, remove, or add any spaces, line breaks, or formatting. The output must match the exact format, spacing, and line breaks of the input text.
\nImportant: Return ONLY the improved text without any introductory phrases, explanations, or commentary.`,
    },
    {
      role: 'user',
      content: `Rewrite the following resume text for maximum impact and clarity. Focus on strengthening action verbs, highlighting achievements, and improving overall readability while maintaining the exact same meaning and Markdown formatting.\n\nKeep the format, spaces, and line breaks exactly as in the selected text. Do not remove or alter any of them.\n\nSelected Text: ${text}`,
    },
  ]
}

/**
 * Message type following the data stream protocol
 * @see https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#data-stream-protocol
 */
enum MessageType {
  Start = 'f',
  Text = '0',
  Error = '3',
}

function extractTextData(
  message: string,
  type: MessageType.Text | MessageType.Error,
) {
  const match = message.match(new RegExp(`${type}:"(.*)"`))
  if (match) return match[1].replaceAll('\\n', '\n')
  return ''
}

export async function* fetchRewrite({
  messages,
  signal,
}: {
  messages: CoreMessage[]
  signal?: AbortSignal
}) {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      signal,
    })

    if (!res.ok || !res.body) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const message = decoder.decode(value, { stream: true })
      const type = message[0]

      if (type === MessageType.Start || type === MessageType.Text) {
        yield extractTextData(message, MessageType.Text)
      }

      if (type === MessageType.Error) {
        throw new Error(extractTextData(message, MessageType.Error))
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('aborted')) return
    throw error
  }
}
