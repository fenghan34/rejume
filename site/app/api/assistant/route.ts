import { openai } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ollama('gemma3:12b'),
    messages,
  });

  return result.toTextStreamResponse();
}
