import { UseChatHelpers } from '@ai-sdk/react'
import { motion } from 'motion/react'
import { generateUUID } from '@/lib/utils'
import { Button } from './ui/button'

export function ChatGreeting({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-end p-8">
      <div className="mx-auto w-full max-w-3xl space-y-36">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-semibold"
          >
            Welcome to Rejume!
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.6 }}
            className="text-zinc-500"
          >
            How can I help you today?
          </motion.div>
        </div>
        {children}
      </div>
    </div>
  )
}

export function QuickActions({
  appendMessage,
  setInput,
}: {
  appendMessage: UseChatHelpers['append']
  setInput: UseChatHelpers['setInput']
}) {
  const actions = [
    {
      title: 'Review my resume',
      prompt:
        'Please review my resume and suggest high-level improvements. Focus on structure, clarity, tone, and any outdated phrasing. Let me know what sections or bullet points could be stronger.',
    },
    {
      title: 'Optimize my resume for ATS',
      prompt:
        'Can you optimize my resume for applicant tracking systems (ATS)? Suggest improvements to formatting, keyword usage, and phrasing that will help my resume get parsed and ranked correctly.',
    },
    {
      title: 'Tailor my resume to a specific job',
      prompt: `I want to tailor my resume to the following job description. Please suggest edits to better align with the role’s responsibilities, required skills, and language.\n\nJob description: \n[Paste here]`,
      input: true,
    },
    {
      title: 'Make my resume more achievement-focused',
      prompt:
        'Please help rewrite my resume to be more achievement-focused. Emphasize outcomes, metrics, and impact where possible instead of just listing responsibilities.',
    },
  ]

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2">
      {actions.map((action, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={action.title}
        >
          <Button
            variant="outline"
            className="w-full h-full block py-2 @3xl/chat:py-4 cursor-pointer text-left whitespace-normal"
            onClick={async () => {
              if (action.input) {
                setInput(action.prompt)
                return
              }

              await appendMessage({
                id: generateUUID(),
                role: 'user',
                content: '',
                parts: [
                  {
                    type: 'text',
                    text: action.prompt,
                  },
                ],
              })
            }}
          >
            {action.title}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
