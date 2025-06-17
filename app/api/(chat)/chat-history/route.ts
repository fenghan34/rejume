import { verifySession } from '@/lib/auth/server'
import { getChatsByResumeId } from '@/lib/db/queries'

export async function GET(req: Request) {
  await verifySession()

  const { searchParams } = new URL(req.url)

  const resumeId = searchParams.get('resumeId')
  if (!resumeId) {
    return new Response(JSON.stringify({ error: 'Missing resume id' }), {
      status: 400,
    })
  }

  const chats = await getChatsByResumeId(resumeId)
  return new Response(JSON.stringify(chats), { status: 200 })
}
