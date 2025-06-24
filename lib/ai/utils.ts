import 'server-only'
import { UIMessage, generateText } from 'ai'
import { providers } from './providers'

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage
}) {
  const { text } = await generateText({
    model: providers.openrouter('meta-llama/llama-4-maverick:free'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return text
}

export async function generateResumeFromPDF(file: File, exampleResume: string) {
  const { text } = await generateText({
    model: providers.openrouter('meta-llama/llama-4-maverick:free'),
    system: `You are a helpful assistant that extracts and structures all relevant information including personal details, work experience, education, skills, and any other sections present from the OCR of user's resume PDF.
      - you should return the information in Markdown format
      - you should return the information in the same language as the resume
      - you should format the information clearly in the same format as the example below

      Example output:
      ${exampleResume}
      `,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            filename: file.name,
            mimeType: 'application/pdf',
            data: await file.bytes(),
          },
        ],
      },
    ],
  })

  return text
}
