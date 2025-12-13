import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"

export const getTasks = async (userToken: string) => {
   const tasks = await prisma.task.findMany({
      where: { user: { token: userToken } }
   })

   return tasks ? tasks : []
}

export const getTaskById = async (id: number) => {
   const task = await prisma.task.findFirst({
      where: { id }
   })

   return task ? task : null
}

export const createTask = async (data: Prisma.TaskCreateInput) => {
   const task = await prisma.task.create({
      data
   })

   return task ? task : null
}

export const updateTask = async (id: number, data: Prisma.TaskUpdateInput) => {
   const task = await getTaskById(id)

   if (!task) return null

   const updatedTask = await prisma.task.update({
      where: { id },
      data
   })

   return updatedTask ? updatedTask : null
}

export const deleteTask = async (id: number, userToken: string) => {
   const task = await getTaskById(id)

   if (!task) return null

   const user = await prisma.user.findFirst({
      where: { token: userToken }
   })

   if (!user) return null

   if (task.userId !== user.id) return null

   const deletedTask = await prisma.task.delete({
      where: { id }
   })

   return deletedTask ? deletedTask : null
}