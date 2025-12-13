import * as userService from "@/src/app/api/services/user"
import { createJWT } from "@/src/lib/create-jwt"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
   const { email, password } = await request.json()

   const invalidCredentials = NextResponse.json(
      { message: "Email/Senha inválidos." },
      { status: 404 }
   )

   const user = await userService.getUserByEmail(email)

   if (!user) return invalidCredentials

   const comparePassword = await bcrypt.compare(password, user.password)

   if (!comparePassword) return invalidCredentials

   const token = await createJWT(email)

   const updated = await userService.updateUserToken(email, token)

   if (!updated) {
      return NextResponse.json(
         { message: "Erro ao realizar login. Tente novamente." },
         { status: 500 }
      )
   }

   return NextResponse.json({ token }, { status: 200 })
}