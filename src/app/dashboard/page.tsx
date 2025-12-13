'use client'
import { Button } from "@/components/ui/button"
import { Task } from "@/generated/prisma/client"
import { api } from "@/src/lib/axios"
import { deleteCookieApp, getCookieApp } from "@/src/lib/cookies"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Dashboard() {
   const [tasks, setTasks] = useState<Task[]>([])

   const cookie = async () => {
      await getCookieApp()
   }

   const getUserTasks = async () => {
      await api.get('/tasks')
         .then(res => {
            setTasks(res.data.tasks)

            toast.success('Tarefas carregadas com sucesso!')
         })
   }

   const handdleLogout = async () => {
      await deleteCookieApp()

      redirect('/login')
   }

   useEffect(() => {
      cookie()
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="flex justify-center items-center gap-4 border">
            <h1 className="text-white text-3xl">Suas Tarefas</h1>

            <Button onClick={handdleLogout}>Sair</Button>
         </div>
      </main>
   )
}