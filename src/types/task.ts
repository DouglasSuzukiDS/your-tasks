import { TaskStatus } from "@/generated/prisma/enums"

export type Task = {
   id: number
   title: string
   description: string
   status: TaskStatus
}