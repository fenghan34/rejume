import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOllama } from 'ollama-ai-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  extraBody: {
    // https://openrouter.ai/docs/features/images-and-pdfs#processing-pdfs
    plugins: [
      {
        id: 'file-parser',
        pdf: {
          engine: 'pdf-text',
        },
      },
    ],
  },
})

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL,
})

export const providers = {
  openrouter,
  ollama,
}
