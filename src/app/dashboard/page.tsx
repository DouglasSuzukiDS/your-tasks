'use client'

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LogOut, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskForm } from "@/src/components/task-form"
import { TaskTable } from "@/src/components/task-table"
import { useTasks } from "@/src/store/task"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/src/components/confirm-dialog"
import { cookie, deleteCookieApp } from "@/src/lib/cookies"
import { redirect, useRouter } from "next/navigation"

export default function Page() {
   const { tasks, setTasks, getUserTasks } = useTasks()
   const [open, setOpen] = useState(false)
   const router = useRouter()

   const handleLogout = async () => {
      await deleteCookieApp()

      router.push('/login')
   }

   useEffect(() => {
      cookie()
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="min-w-2/3 h-full flex justify-center items-center gap-4 flex-col scroll-auto">
            <div className="flex justify-between items-center gap-4 w-full">
               <h1 className="text-gray-300 text-3xl">Suas Tarefas</h1>

               <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger>
                     <Label className="flex justify-center items-center text-gray-300 gap-2 px-3 py-2 rounded-md cursor-pointer bg-blue-500">
                        <PlusIcon className="text-sm" />
                        Nova tarefa
                     </Label>
                  </AlertDialogTrigger>

                  <TaskForm setOpen={setOpen} />

               </AlertDialog>

               <ConfirmDialog
                  label="Logout"
                  iconLabel={<LogOut />}
                  title="Deletar tarefa"
                  description="Tem certeza que deseja realizar o logout?"
                  onConfirm={handleLogout} />
            </div>

            <div className="w-full flex-1 overflow-y-auto">
               <TaskTable tasks={tasks} />
            </div>
         </div>
      </main>
   )
}