'use client'

import { formatDistance } from 'date-fns'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { startTransition, useOptimistic } from 'react'
import { toast } from 'sonner'
import { deleteResume, updateResume } from '@/app/resume/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
  const [optimisticName, addOptimisticName] = useOptimistic<string, string>(
    name,
    (_, newName) => newName,
  )

  return (
    <motion.div
      className="space-y-3 flex flex-col items-center"
      initial={{ x: -30, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
    >
      <div className="relative group hover:scale-105 transition-transform duration-200 ease-in-out">
        <DeleteButton id={id} />

        <Link
          className="w-60 h-fit block aspect-[calc(210/297)] border overflow-hidden rounded"
          href={`/resume/${id}`}
        >
          <Preview content={content} className="pointer-events-none" />
        </Link>
      </div>

      <div className="w-60 flex flex-col justify-center text-center space-y-0.5">
        <EditableTitle
          value={optimisticName}
          onSave={async (v) => {
            if (name !== v) {
              startTransition(async () => {
                addOptimisticName(v)

                try {
                  await updateResume(id, { name: v })
                } catch (e) {
                  console.error(e)
                  toast.error('Failed to update resume name, please try again.')
                }
              })
            }
          }}
        />
        <div suppressHydrationWarning className="text-xs text-muted-foreground">
          {formatDistance(new Date(updatedAt), new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
    </motion.div>
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
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            resume and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteResume(id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
