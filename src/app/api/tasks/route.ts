import { NextResponse } from "next/server"
import { getUserByToken } from "../services/user"
import { createTask, getTasks } from "../services/task"
import { getTokenFromRequest, unauthorizedResponse } from "@/src/lib/auth"

export async function GET(request: Request) {
   const token = getTokenFromRequest(request)

   if (!token) return unauthorizedResponse()

   const user = await getUserByToken(token)

   if (!user || user.token === '') return unauthorizedResponse()

   const userTasks = await getTasks(token)

   return NextResponse.json(
      { tasks: userTasks },
      { status: 200 }
   )
}

export async function POST(request: Request) {
   const token = getTokenFromRequest(request)

   if (!token) return unauthorizedResponse()

   const { title, description, status } = await request.json()

   const user = await getUserByToken(token)

   if (!user || user.token === '') return unauthorizedResponse()

   const task = await createTask({
      title,
      description,
      status,
      user: {
         connect: { token }
      }
   })

   if (!task) {
      return NextResponse.json(
         { message: "Erro ao criar a tarefa." },
         { status: 500 }
      )
   }

   return NextResponse.json(
      { message: "Tarefa criada com sucesso.", task },
      { status: 201 }
   )
}