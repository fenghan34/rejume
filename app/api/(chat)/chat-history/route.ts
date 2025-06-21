import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth/server'
import { getChatsByResumeId } from '@/lib/db/queries'

export const GET = withAuth(async (req: NextRequest, context) => {
  console.log(context)
  const searchParams = req.nextUrl.searchParams
  const resumeId = searchParams.get('resumeId')

  if (!resumeId) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const chats = await getChatsByResumeId(resumeId)
  return new Response(JSON.stringify(chats), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
