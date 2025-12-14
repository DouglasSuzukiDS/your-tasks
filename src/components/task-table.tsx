import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Task } from "../types/task"
import { Button } from "@/components/ui/button"
import { PlusIcon, ScanEye, View, ViewIcon } from "lucide-react"
import { TaskForm } from "./task-form"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ChangeEvent, useEffect, useState } from "react"
import { TaskStatus } from "../types/task-status"
import { Input } from "@/components/ui/input"
import { useTasks } from "../store/task"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
   tasks: Task[]
}

export const TaskTable = ({ tasks }: Props) => {
   const [search, setSearch] = useState('')
   const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")

   const [cloneTasks, setCloneTasks] = useState<Task[]>([])
   const [openTaskId, setOpenTaskId] = useState<number | null>(null)

   const { setTasks } = useTasks()

   const searchTask = (term: string, status: TaskStatusFilter) => {
      setSearch(term)
      setStatusFilter(status)

      if (term === '' && status === 'all') {
         setCloneTasks(tasks)
         return
      }

      if (term === '' && status !== 'all') {
         const filteredStatus = tasks.filter(task => {
            return task.status.toLocaleLowerCase() === status.toLocaleLowerCase()
         })
         setCloneTasks(filteredStatus)
         return
      }

      if (term !== '' && status === 'all') {
         const filteredTerm = tasks.filter(task => {
            return task.title.toLowerCase()
               .includes(term.toLowerCase())
         })

         setCloneTasks(filteredTerm)
         return
      }

      const filteredTerm = tasks.filter(task => {
         return task.title.toLowerCase()
            .includes(term.toLowerCase())
      })

      const finalFiltered = filteredTerm.filter(task => {
         return task.status.toLocaleLowerCase() === status.toLocaleLowerCase()
      })

      setCloneTasks(finalFiltered)
   }

   const translateStatus = (status: TaskStatus) => {
      switch (status.toLocaleLowerCase()) {
         case 'pending':
            return 'Pendente'
         case 'in_progress':
            return 'Em Progresso'
         case 'completed':
            return 'Concluído'
         default:
            return status
      }
   }

   type TaskStatusFilter = TaskStatus | 'all'

   const statusOptions: { value: TaskStatusFilter, label: string }[] = [
      { value: 'all', label: 'Todos' },
      { value: 'pending', label: 'Pendente' },
      { value: 'in_progress', label: 'Em Progresso' },
      { value: 'completed', label: 'Concluído' },
   ]

   useEffect(() => {
      setCloneTasks(tasks)
   }, [tasks])

   return (
      <div className="flex flex-col w-full gap-4">
         <div className="flex flex-col gap-4 md:flex-row">
            <Input
               placeholder="Buscar tarefa..."
               value={search}
               onChange={(e) => searchTask(e.target.value, statusFilter)}
               type="search"
               className="text-gray-400" />

            <Select
               value={statusFilter}
               onValueChange={(value) => searchTask(search, value as TaskStatusFilter)}>
               <SelectTrigger className="text-gray-400 font-medium w-auto">
                  <SelectValue defaultValue={'pending'} placeholder="Status" className="text-blue-800" />
               </SelectTrigger>

               <SelectContent className="bg-gray-600 w-auto">
                  {statusOptions.map((status) => (
                     <SelectItem key={status.label} value={status.value} className="text-gray-300 data-[state=checked]:text-blue-400 data-[state=checked]:font-medium">
                        {status.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="h-20">
            <Table className="">
               <TableCaption>
                  {cloneTasks.length === 0 && 'Nenhuma tarefa encontrada. 🫣'}
                  {cloneTasks.length === 1 ? '1 tarefa encontrada. 🫰' : `${cloneTasks.length >= 2 ? 'tarefas encontradas. 🫰' : ''}`}
               </TableCaption>

               <TableHeader>
                  <TableRow>
                     <TableHead className="text-gray-300">Status</TableHead>
                     <TableHead className="text-gray-300">Título</TableHead>
                     <TableHead className="text-gray-300">Descrição</TableHead>
                     <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody className="">
                  {cloneTasks.map((task) => (
                     <TableRow key={task.id}>
                        <TableCell className="text-gray-400 font-semibold">{translateStatus(task.status)}</TableCell>
                        <TableCell className="text-gray-400 font-semibold">{task.title}</TableCell>
                        <TableCell className="text-gray-400 font-semibold truncate">{task.description}</TableCell>
                        <TableCell>
                           <AlertDialog
                              open={openTaskId === task.id}
                              onOpenChange={(open) => setOpenTaskId(open ? task.id : null)}>

                              <AlertDialogTrigger asChild>
                                 <Button>
                                    <ViewIcon className="text-sm" />
                                    Visualizar
                                 </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent className="bg-gray-800">
                                 <AlertDialogHeader>
                                    <AlertDialogTitle className="text-gray-300">Nova tarefa</AlertDialogTitle>

                                    <AlertDialogDescription className="text-gray-400">
                                       Insira os detalhes da sua nova tarefa aqui.
                                       <TaskForm task={task} setOpen={() => setOpenTaskId(null)} />
                                    </AlertDialogDescription>

                                 </AlertDialogHeader>

                              </AlertDialogContent>

                           </AlertDialog>

                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}