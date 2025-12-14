import { TaskStatus } from "@/generated/prisma/enums"

export type Task = {
   id: number
   title: string
   description: string
   status: TaskStatus
   createdAt: Date
   updatedAt?: Date
   userId: number
}

export type TaskData = {
   title: string
   description: string
   status: TaskStatus
}