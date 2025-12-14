'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NotFound() {
   const [redirecting, setRedirecting] = useState(3)
   const router = useRouter()

   useEffect(() => {
      const interval = setInterval(() => {
         setRedirecting(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
   }, [])

   useEffect(() => {
      if (redirecting === 0) {
         router.push('/login')
      }
   }, [redirecting])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex flex-col gap-4 justify-center items-center">
         <h1 className="text-center text-gray-300 text-3xl">
            404 - Página Não Encontrada</h1>

         <p className="text-center text-gray-300 text-2xl">
            Você será redirecionado em {redirecting} {redirecting === 1 ? 'segundo' : 'segundos'}.</p>
      </main>
   )
}