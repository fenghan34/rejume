import type { CoreMessage } from "ai"
import ky from "ky"

export function buildRewriteMessages(text: string): CoreMessage[] {
  return [
    {
      role: 'system',
      content: `You are an AI writing assistant specialized in improving resume content written in Markdown. Your task is to rewrite the provided text while maintaining clarity professionalism, and conciseness. Ensure the output remains suitable for a resume, optimizing word choice and sentence structure. Preserve Markdown formatting and do not add unnecessary details. Do not include introductory phrases like \"Here\'s a revised version of the text"—only return the improved text.`
    },
    {
      role: 'user',
      content: `Rewrite the following resume text for better readability and impact while keeping the meaning unchanged. Maintain Markdown formatting.\nSelected Text: ${text}`
    }
  ]
}

export function buildGrammarCheckMessages(text: string): CoreMessage[] {
  return [
    {
      role: 'system',
      content: `You are an AI grammar assistant that helps improve resume content written in Markdown. Your task is to correct grammar, spelling and sentence structure while keeping the text professional and concise.
      Maintain Markdown formatting and do not alter the original meaning. Do not add explanations or introductory text—only return the corrected version.`
    },
    {
      role: 'user',
      content: `Rewrite the following resume text for better readability and impact while keeping the meaning unchanged. Maintain Markdown formatting.\nSelected Text: ${text}`
    }
  ]
}

/**
 * Message type following the data stream protocol
 * @see https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#data-stream-protocol
 */
enum MessageType {
  Start = 'f',
  Text = '0',
  Error = '3'
}

function extractTextData(message: string, type: MessageType.Text | MessageType.Error) {
  const match = message.match(new RegExp(`${type}:"(.*)"`))
  if (match) return match[1].replaceAll('\\n', '\n')
  return ''
}

export async function* fetchSuggestion({ messages, signal }: {
  messages: CoreMessage[],
  signal?: AbortSignal,
}) {
  try {
    const res = await ky.post('/api/assistant', {
      body: JSON.stringify({
        messages
      }),
      signal
    })

    if (!res.ok || !res.body) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const message = decoder.decode(value, { stream: true });
      const type = message[0]

      if (type === MessageType.Start || type === MessageType.Text) {
        yield extractTextData(message, MessageType.Text)
      }

      if (type === MessageType.Error) {
        throw new Error(extractTextData(message, MessageType.Error))
      }
    }
  } catch (error: any) {
    if (error?.message.includes('aborted')) return
    throw error
  }
}
