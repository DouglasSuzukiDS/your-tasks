import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "../../services/user"

export async function POST(request: Request) {
   const { name, email, password } = await request.json()

   if (!name || !email || !password) {
      return NextResponse.json({ error: 'Preencha os campos corretamente.' })
   }

   const has = await getUserByEmail(email)

   if (has) return NextResponse.json({ error: 'Não foi possível realizar o cadastro. Tente novamente.' })

   const newUser = await createUser({ name, email, password })

   if (!newUser) return NextResponse.json({ error: 'Erro ao criar usuário' })

   return NextResponse.json(
      { message: 'Usuário criado com sucesso' },
      { status: 201 }
   )
}