import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const model = openrouter.chat(
  'mistralai/mistral-small-3.1-24b-instruct:free',
)
