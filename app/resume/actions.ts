'use server'

import { revalidatePath } from 'next/cache'
import * as queries from '@/lib/db/queries'
import { ResumeSchema } from '@/lib/db/schema'

export async function getResumeById(id: string) {
  return await queries.getResumeById(id)
}

export async function createNewResume(
  data: Pick<ResumeSchema, 'name' | 'content'>,
) {
  await queries.createResume(data)
  revalidatePath('/resume')
}

export async function updateResume(
  id: string,
  data: Partial<Pick<ResumeSchema, 'name' | 'content'>>,
) {
  await queries.updateResume(id, data)
  revalidatePath(`/resume/${id}`)
}

export async function deleteResume(id: string) {
  await queries.deleteResume(id)
  revalidatePath('/resume')
}
