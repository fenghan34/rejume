'use client'

import { formatDistance } from 'date-fns'
import { Ellipsis } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import React from 'react'
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

export function ResumeCard({
  id,
  title,
  content,
  updatedAt,
  onDelete,
  onDuplicate,
  onUpdate,
}: Omit<ResumeModel, 'createdAt' | 'userId'> & {
  onDelete: (id: string) => void
  onDuplicate: (data: Pick<ResumeModel, 'title' | 'content'>) => void
  onUpdate: (data: Pick<ResumeModel, 'title' | 'id'>) => void
}) {
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
              onSelect={() =>
                onDuplicate({
                  title,
                  content,
                })
              }
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          className="w-60 h-fit block aspect-[calc(210/297)] border overflow-hidden rounded"
          href={`/dashboard/${id}`}
          prefetch
        >
          <Preview content={content} className="pointer-events-none" />
        </Link>
      </div>

      <div className="w-4/5 flex flex-col justify-center text-center space-y-0.5">
        <ResumeTitle value={title} onSave={(v) => onUpdate({ id, title: v })} />
        <div suppressHydrationWarning className="text-xs text-muted-foreground">
          {formatDistance(new Date(updatedAt), new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
    </motion.div>
  )
}
