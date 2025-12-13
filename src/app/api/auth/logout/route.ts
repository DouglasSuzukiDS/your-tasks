import { NextResponse } from "next/server"
import { getUserByToken, updateUserToken } from "../../services/user"

export async function PUT(request: Request) {
   const token = request.headers.get('Authorization')?.split('Bearer ')[1]

   if (!token) {
      return NextResponse.json(
         { message: "Não autorizado." },
         { status: 404 }
      )
   }

   const user = await getUserByToken(token)

   if (!user || user.token === '') {
      return NextResponse.json(
         { message: "Não autorizado." },
         { status: 404 }
      )
   }

   await updateUserToken(user.email, '')

   return NextResponse.json(
      { message: "Logout realizado com sucesso." },
      { status: 200 }
   )
}