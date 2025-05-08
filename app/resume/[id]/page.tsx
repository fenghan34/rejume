import { ResumePageContent } from './page-content'

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <ResumePageContent id={id} />
}
