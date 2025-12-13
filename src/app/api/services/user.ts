import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export const getUsers = async () => {
   const users = await prisma.user.findMany()

   return users ? users : []
}

export const getUserById = async (id: number) => {
   const user = await prisma.user.findFirst({
      where: { id }
   })

   return user ? user : null
}

export const getUserByEmail = async (email: string) => {
   const user = await prisma.user.findUnique({
      where: { email }
   })

   return user ? user : null
}

export const getUserByToken = async (token: string) => {
   const user = await prisma.user.findFirst({
      where: { token }
   })

   if (!user) return null

   const data = { email: user.email, token: user.token }

   return data
}

export const createUser = async (data: Prisma.UserCreateInput) => {
   const findUser = await getUserByEmail(data.email)

   if (findUser) return null

   const hashedPassword = await bcrypt.hash(data.password, 10)

   const user = await prisma.user.create({
      data: {
         ...data,
         password: hashedPassword
      }
   })

   return user ? user : null
}

export const updateUser = async (id: number, data: Prisma.UserUpdateInput) => {
   const user = await getUserById(id)

   if (!user) return null

   const updatedUser = await prisma.user.update({
      where: { id },
      data: {
         ...data,
         password: data.password ? await bcrypt.hash(data.password as string, 10) : user.password
      }
   })

   return updatedUser ? updatedUser : null
}

export const updateUserToken = async (email: string, token: string) => {
   const user = await getUserByEmail(email)

   if (!user) return null

   const updatedUser = await prisma.user.update({
      where: { email },
      data: {
         token
      }
   })

   return updatedUser ? updatedUser : null
}

export const deleteUser = async (id: number) => {
   const user = await getUserById(id)

   if (!user) return null

   const deletedUser = await prisma.user.delete({
      where: { id }
   })

   return deletedUser ? deletedUser : null
}