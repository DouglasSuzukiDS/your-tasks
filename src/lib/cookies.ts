'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const getCookieApp = async () => {
   const cookie = await cookies()

   const token = cookie.get('token')

   if (!token) redirect('/login')

   return token.value
}

export const setCookieApp = async (token: string) => {
   const cookie = await cookies()

   cookie.set('token', token)
}

export const deleteCookieApp = async () => {
   const cookie = await cookies()

   cookie.delete('token')
}