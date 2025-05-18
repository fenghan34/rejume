'use client'

import { formatDistance } from 'date-fns'
import { X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
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
import { ResumeModel } from '@/lib/db/schema'
import { EditableTitle } from './editable-title'
import { Preview } from './preview'
import { Button } from './ui/button'

export function ResumeCard({ id, name, content, updatedAt }: ResumeModel) {
  return (
    <div className="space-y-3 flex flex-col items-center">
      <div className="relative group hover:scale-105 transition-transform duration-200">
        <DeleteButton id={id} />

        <Link
          className="w-60 h-fit block aspect-[calc(210/297)] border overflow-hidden rounded"
          href={`/resume/${id}`}
        >
          <Preview content={content} className="pointer-events-none" />
        </Link>
      </div>

      <div className="text-center space-y-0.5">
        <EditableTitle
          value={name}
          onSave={async (v) => {
            if (name !== v) {
              try {
                await updateResume(id, { name: v })
              } catch (e) {
                console.error(e)
                toast.error('Failed to update resume name')
              }
            }
          }}
        />
        <div suppressHydrationWarning className="text-xs text-muted-foreground">
          {formatDistance(new Date(updatedAt), new Date(), {
            addSuffix: true,
          })}
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
          className="absolute top-0 right-0 z-10 cursor-pointer group-hover:visible invisible opacity-60 hover:opacity-100 hover:bg-inherit"
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
