'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Task } from "@/generated/prisma/client"
import { TaskForm } from "@/src/components/task-form"
import { api } from "@/src/lib/axios"
import { deleteCookieApp, getCookieApp } from "@/src/lib/cookies"
import { Check, LogOut, PlusIcon, X } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Dashboard() {
   const [tasks, setTasks] = useState<Task[]>([])

   const getData = async () => {
      const cookie = await getCookieApp()

      if (!cookie) return redirect('/login')

      console.log('Token:', cookie)

      await getUserTasks()
   }

   const getUserTasks = async () => {
      await api.get('/tasks')
         .then(res => {
            setTasks(res.data.tasks)

            toast.success('Tarefas carregadas com sucesso!')
         })
   }

   const handleLogout = async () => {
      await deleteCookieApp()

      redirect('/login')
   }

   const handleSave = async () => {
      toast.success('Tarefa criada com sucesso!')
   }

   useEffect(() => {
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="flex justify-center items-center gap-4 border">
            <h1 className="text-white text-3xl">Suas Tarefas</h1>

            <AlertDialog>
               <AlertDialogTrigger>
                  <Button>
                     <PlusIcon />
                     Nova tarefa
                  </Button>
               </AlertDialogTrigger>

               <AlertDialogContent className="bg-gray-800">
                  <AlertDialogHeader>
                     <AlertDialogTitle className="text-gray-300">Nova tarefa</AlertDialogTitle>

                     <AlertDialogDescription className="text-gray-400">
                        Insira os detalhes da sua nova tarefa aqui.

                        <TaskForm />
                     </AlertDialogDescription>

                  </AlertDialogHeader>

                  <AlertDialogFooter>
                     <AlertDialogCancel>
                        <X />
                        Cancelar
                     </AlertDialogCancel>

                     <AlertDialogAction onClick={handleSave}>
                        <Check />
                        Confirmar
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
               <AlertDialogTrigger>
                  <Button variant="secondary">
                     <LogOut />
                     Logout
                  </Button>
               </AlertDialogTrigger>

               <AlertDialogContent className="bg-gray-800">
                  <AlertDialogHeader>
                     <AlertDialogTitle className="text-gray-300">Realmente deseja sair?</AlertDialogTitle>

                     <AlertDialogDescription className="text-gray-400">
                        Ao sair você terá que fazer login novamente para acessar suas tarefas.
                     </AlertDialogDescription>

                  </AlertDialogHeader>

                  <AlertDialogFooter>
                     <AlertDialogCancel>
                        <X />
                        Cancelar
                     </AlertDialogCancel>

                     <AlertDialogAction onClick={handleLogout}>
                        <Check />
                        Confirmar
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         </div>
      </main>
   )
}