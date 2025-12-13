import { NextResponse } from "next/server"
import * as userService from "@/src/app/api/services/user"

export async function POST(request: Request) {
   const { email } = await request.json()

   const user = await userService.getUserByEmail(email)

   if (!user) {
      return NextResponse.json(
         { exists: false },
         { status: 203 }
      )
   }

   return NextResponse.json(
      { exists: true },
      { status: 200 }
   )
}