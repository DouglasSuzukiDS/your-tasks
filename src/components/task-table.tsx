import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Task } from "../types/task"
import { Button } from "@/components/ui/button"
import { ScanEye, View, ViewIcon } from "lucide-react"

type Props = {
   tasks: Task[]
}

export const TaskTable = ({ tasks }: Props) => {
   const translateStatus = (status: string) => {
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

   return (
      <Table className="border">
         <TableCaption>Tarefas encontradas. 🫰</TableCaption>

         <TableHeader>
            <TableRow>
               <TableHead className="text-gray-300">Status</TableHead>
               <TableHead className="text-gray-300">Título</TableHead>
               <TableHead className="text-gray-300">Descrição</TableHead>
               <TableHead className="text-gray-300">Ações</TableHead>
            </TableRow>
         </TableHeader>

         <TableBody>
            {tasks.map((task) => (
               <TableRow>
                  <TableCell className="text-gray-400 font-semibold">{translateStatus(task.status)}</TableCell>

                  <TableCell className="text-gray-400 font-semibold">{task.title}</TableCell>

                  <TableCell className="text-gray-400 font-semibold truncate">{task.description}</TableCell>

                  <TableCell>
                     <Button>
                        <ScanEye />
                        Visualizar
                     </Button>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>

      </Table>
   )
}