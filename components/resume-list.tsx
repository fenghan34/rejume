'use client'

import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  createResume,
  deleteResume,
  getResumeList,
  updateResume,
} from '@/app/dashboard/actions'
import { ResumeModel } from '@/lib/db/schema'
import { ResumeCard } from './resume-card'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function ResumeList() {
  const queryClient = useQueryClient()
  const queryKey = ['resumes']

  const { data, error } = useQuery<ResumeModel[]>({
    queryKey,
    queryFn: getResumeList,
  })

  const createMutation = useMutation({
    mutationFn: createResume,
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })

      const previousResumes = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: ResumeModel[]) =>
        old.filter((resume) => resume.id !== id),
      )

      return { previousResumes }
    },
    onError: (_, __, context) => {
      toast.error('Failed to delete resume, please try again.')
      queryClient.setQueryData(queryKey, context!.previousResumes)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const duplicateMutation = useMutation({
    mutationFn: ({
      title,
      content,
    }: Pick<ResumeModel, 'title' | 'content'>) => {
      return createResume({ title: `${title} (Copy)`, content })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const updateMutation = useMutation({
    mutationFn: (data: Pick<ResumeModel, 'title' | 'id'>) => {
      return updateResume(data.id, { title: data.title })
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey })

      const previousResumes = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ResumeModel[]) =>
        old.map((resume) =>
          resume.id === data.id ? { ...resume, title: data.title } : resume,
        ),
      )

      return { previousResumes }
    },
    onError: (_, __, context) => {
      toast.error('Failed to update resume, please try again.')
      queryClient.setQueryData(queryKey, context!.previousResumes)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="flex flex-wrap gap-10 p-6">
      <Button
        title="New example resume"
        variant="ghost"
        className={
          'w-60 h-fit aspect-[calc(210/297)] hover:scale-105 transition-transform duration-200 ease-in-out bg-background dark:bg-background/60 flex items-center justify-center rounded shadow-md border border-input text-muted-foreground cursor-pointer hover:bg-background'
        }
        onClick={async () => {
          const { default: exampleResume } = await import('@/examples/en.md')
          createMutation.mutate({
            title: '',
            content: exampleResume,
          })
        }}
      >
        <Plus />
      </Button>

      {(createMutation.isPending || duplicateMutation.isPending) && (
        <Skeleton className="w-60 h-fit aspect-[calc(210/297)] border rounded" />
      )}

      {data?.map((resume) => (
        <ResumeCard
          {...resume}
          key={resume.id}
          onDelete={deleteMutation.mutate}
          onDuplicate={duplicateMutation.mutate}
          onUpdate={updateMutation.mutate}
        />
      ))}
    </div>
  )
}
