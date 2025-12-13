import { NextRequest, NextResponse } from 'next/server'
import { getUserByToken } from "../app/api/services/user"

export async function middleware(request: NextRequest) {
   const authHeader = request.headers.get('authorization')

   const notAllowed = NextResponse.json(
      { error: "Não Autorizado" },
      { status: 401 })

   const publicPaths = ['/api/auth/validate', '/api/auth/login', '/api/auth/register'];

   if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
   }

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return notAllowed
   }

   const tokenSplit = authHeader.split('Bearer ')

   if (!tokenSplit[1]) {
      return notAllowed
   }

   const token = tokenSplit[1]

   const userToken = await getUserByToken(token)

   if (!userToken) {
      return notAllowed
   }

   const requestHeaders = new Headers(request.headers)
   requestHeaders.set('Authorization', userToken.token as string)

   return NextResponse.next({
      request: {
         headers: requestHeaders,
      }
   })
}

export const config = {
   matcher: '/api/:path*',
};