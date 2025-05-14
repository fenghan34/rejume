'use client'

import { formatDistance } from 'date-fns'
import { X } from 'lucide-react'
import Link from 'next/link'
import { deleteResume, updateResume } from '@/app/resume/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ResumeSchema } from '@/lib/db/schema'
import { EditableTitle } from './editable-title'
import { Preview } from './preview'
import { Button } from './ui/button'

export function ResumeCard({ id, name, content, updatedAt }: ResumeSchema) {
  console.log(new Date(updatedAt).getDate() - new Date().getDate())
  return (
    <div className="h-fit relative hover:scale-105 hover:opacity-100 transition-transform duration-200 cursor-pointer opacity-90 group/resume-card">
      <DeleteButton id={id} />

      <div className="w-60 flex flex-col items-center space-y-3">
        <Link
          className={`w-full h-fit aspect-[calc(210/297)] border`}
          href={`/resume/${id}`}
        >
          <Preview
            content={content}
            className="overflow-hidden pointer-events-none"
          />
        </Link>

        <div className="text-center space-y-0.5">
          <EditableTitle
            value={name}
            onSave={(v) => {
              if (name !== v) {
                updateResume(id, { name: v })
              }
            }}
          />
          <div
            suppressHydrationWarning
            className="text-xs text-muted-foreground"
          >
            {formatDistance(new Date(updatedAt), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute top-0 right-0 z-10 cursor-pointer group-hover/resume-card:visible invisible opacity-60 hover:opacity-100 hover:bg-inherit"
          variant="ghost"
          size="icon"
        >
          <X />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this resume?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteResume(id)}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
