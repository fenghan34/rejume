'use client'

import { formatDistance } from 'date-fns'
import { Ellipsis } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import React, {
  // @ts-expect-error ViewTransition is experimental
  unstable_ViewTransition as ViewTransition,
} from 'react'
import { toast } from 'sonner'
import { createResume, deleteResume } from '@/app/resume/actions'
import { ResumeModel } from '@/lib/db/schema'
import { Preview } from './preview'
import { ResumeTitle } from './resume-title'
import { Button } from './ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from './ui/dropdown-menu'

export function ResumeCard({ id, name, content, updatedAt }: ResumeModel) {
  return (
    <ViewTransition name={`resume-${id}`}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="size-8 absolute top-1 right-1 z-10 cursor-pointer group-hover:visible invisible opacity-60 hover:opacity-100 hover:bg-inherit"
                variant="ghost"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  toast.promise(
                    createResume({
                      name: `${name} (Copy)`,
                      content,
                    }),
                    {
                      error: 'Failed to duplicate resume, please try again.',
                    },
                  )
                }}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  toast.promise(deleteResume(id), {
                    error: 'Failed to delete resume, please try again.',
                  })
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            className="w-60 h-fit block aspect-[calc(210/297)] border overflow-hidden rounded"
            href={`/resume/${id}`}
          >
            <Preview content={content} className="pointer-events-none" />
          </Link>
        </div>

        <div className="w-3/4 flex flex-col justify-center text-center space-y-0.5">
          <ResumeTitle resumeId={id} title={name} />
          <div
            suppressHydrationWarning
            className="text-xs text-muted-foreground"
          >
            {formatDistance(new Date(updatedAt), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </motion.div>
    </ViewTransition>
  )
}
