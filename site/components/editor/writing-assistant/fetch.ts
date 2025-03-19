import type { CoreMessage } from "ai"

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

export async function* fetchSuggestion({ messages, signal }: {
  messages: CoreMessage[],
  signal?: AbortSignal,
}) {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        messages
      }),
      headers: {
        "Content-Type": "application/json",
      },
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

      yield decoder.decode(value, { stream: true });
    }

  } catch (error: any) {
    if (error?.message.includes('aborted')) return
    throw error
  }
}
