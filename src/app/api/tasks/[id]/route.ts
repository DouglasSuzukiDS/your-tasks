import { getTokenFromRequest, unauthorizedResponse } from "@/src/lib/auth"
import { getUserByToken } from "../../services/user"
import { deleteTask, updateTask } from "../../services/task"
import { NextResponse } from "next/server"
import { taskSchema, updatedTaskSchema } from "@/src/schemas/task"

export async function PUT(
   request: Request,
   { params }: { params: { id: string } }) {
   const { id } = await params

   const token = getTokenFromRequest(request)

   if (!token) return unauthorizedResponse()

   const user = await getUserByToken(token)

   if (!user || user.token === '') return unauthorizedResponse()

   const data = await request.json()

   const dataValidation = updatedTaskSchema.safeParse(data)

   if (!dataValidation.success) {
      return NextResponse.json(
         { message: "Dados inválidos.", errors: dataValidation.error.flatten().fieldErrors },
         { status: 400 }
      )
   }

   const dataFormatted = {
      ...data,
      status: data.status.toUpperCase()
   }

   const editTask = await updateTask(Number(id), dataFormatted)

   if (!editTask) {
      return NextResponse.json(
         { message: "Erro ao atualizar a tarefa." },
         { status: 500 }
      )
   }

   return NextResponse.json(
      { message: "Tarefa atualizada com sucesso.", task: editTask },
      { status: 200 }
   )
}

export async function DELETE(
   request: Request,
   { params }: { params: { id: string } }) {
   const { id } = await params

   const token = getTokenFromRequest(request)

   if (!token) return unauthorizedResponse()

   const user = await getUserByToken(token)

   if (!user || user.token === '') return unauthorizedResponse()

   const deletedTask = await deleteTask(Number(id), token)

   if (!deletedTask) {
      return NextResponse.json(
         { message: "Erro ao deletar a tarefa." },
         { status: 500 }
      )
   }

   return NextResponse.json(
      { message: "Tarefa deletada com sucesso." },
      { status: 200 }
   )
}