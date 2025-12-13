import { NextResponse } from "next/server";

export function getTokenFromRequest(request: Request) {
   const token = request.headers.get('Authorization')?.split('Bearer ')[1]

   return token || null
}

export function unauthorizedResponse() {
   return NextResponse.json(
      { message: "Não autorizado." },
      { status: 404 }
   );
}