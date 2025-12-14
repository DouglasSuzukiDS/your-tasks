'use client'

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Task } from "@/generated/prisma/client"
import { api } from "@/src/lib/axios"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TaskForm } from "@/src/components/task-form"
import { LogoutDialog } from "@/src/components/logout-dialog"
import { TaskTable } from "@/src/components/task-table"

export default function Dashboard() {
   const [tasks, setTasks] = useState<Task[]>([])
   const [open, setOpen] = useState(false)

   const getUserTasks = async () => {
      await api.get('/tasks')
         .then(res => {
            setTasks(res.data.tasks)

            toast.success('Tarefas carregadas com sucesso!')
         })
   }

   useEffect(() => {
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="min-w-2/3 flex justify-center items-center gap-4 border flex-col">
            <div className="flex justify-between items-center gap-4 w-full mb-4">
               <h1 className="text-white text-3xl">Suas Tarefas</h1>

               <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 has-[>svg]:px-3">
                     <PlusIcon className="text-sm" />
                     Nova tarefa
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-gray-800">
                     <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-300">Nova tarefa</AlertDialogTitle>

                        <AlertDialogDescription className="text-gray-400">
                           Insira os detalhes da sua nova tarefa aqui.

                           <TaskForm getUserTasks={getUserTasks} setOpen={setOpen} />

                        </AlertDialogDescription>

                     </AlertDialogHeader>


                  </AlertDialogContent>
               </AlertDialog>

               <LogoutDialog />
            </div>

            <TaskTable tasks={tasks} />
         </div>

      </main>
   )
}