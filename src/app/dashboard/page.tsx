'use client'

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskForm } from "@/src/components/task-form"
import { LogoutDialog } from "@/src/components/logout-dialog"
import { TaskTable } from "@/src/components/task-table"
import { Button } from "@/components/ui/button"
import { useTasks } from "@/src/store/task"
import { Label } from "@/components/ui/label"
import { DialogHeader } from "@/components/ui/dialog"

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
                  <AlertDialogTrigger>
                     <Label className="flex items-center text-gray-400 gap-2 cursor-pointer">
                        <PlusIcon className="text-sm" />
                        Nova tarefa
                     </Label>
                  </AlertDialogTrigger>

                  <TaskForm setOpen={setOpen} />

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