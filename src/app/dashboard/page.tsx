'use client'

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskForm } from "@/src/components/task-form"
import { LogoutDialog } from "@/src/components/logout-dialog"
import { TaskTable } from "@/src/components/task-table"
import { Button } from "@/components/ui/button"
import { useTasks } from "@/src/store/task"

export default function Dashboard() {
   const { tasks, setTasks, getUserTasks } = useTasks()
   const [open, setOpen] = useState(false)

   useEffect(() => {
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="min-w-2/3 h-full flex justify-center items-center gap-4 border flex-col scroll-auto">
            <div className="flex justify-between items-center gap-4 w-full mb-4">
               <h1 className="text-white text-3xl">Suas Tarefas</h1>

               <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                     <Button>
                        <PlusIcon className="text-sm" />
                        Nova tarefa
                     </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-gray-800">
                     <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-300">Nova tarefa</AlertDialogTitle>

                        <AlertDialogDescription className="text-gray-400">
                           Insira os detalhes da sua nova tarefa aqui.

                           <TaskForm setOpen={setOpen} />

                        </AlertDialogDescription>

                     </AlertDialogHeader>

                  </AlertDialogContent>
               </AlertDialog>

               <LogoutDialog />
            </div>

            <div className="w-full flex-1 p-2 overflow-y-auto">
               <TaskTable tasks={tasks} />
            </div>
         </div>
      </main>
   )
}