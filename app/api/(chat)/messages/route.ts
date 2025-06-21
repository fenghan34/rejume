import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth/server'
import { getMessagesByChatId } from '@/lib/db/queries'

async function secretGET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const chatId = searchParams.get('chatId')

  if (!chatId) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const messages = await getMessagesByChatId(chatId)
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET = withAuth(secretGET)
