'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { api } from "./axios"

export const getCookieApp = async () => {
   const cookie = await cookies()

   const token = cookie.get('token')

   if (!token) redirect('/login')

   api.defaults.headers.common['Authorization'] = `Bearer ${token}`

   return true
}

export const setCookieApp = async (token: string) => {
   const cookie = await cookies()

   cookie.set('token', token, { httpOnly: true })
}

export const deleteCookieApp = async () => {
   const cookie = await cookies()

   cookie.delete('token')
}