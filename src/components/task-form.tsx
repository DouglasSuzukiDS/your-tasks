"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea, } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X } from "lucide-react"
import { api } from "../lib/axios"
import { AlertDialogCancel } from "@/components/ui/alert-dialog"
import { TaskStatus } from "../types/task-status"
import { Task, TaskData } from "../types/task"
import { useTasks } from "../store/task"
import { useEffect } from "react"

const formSchema = z.object({
   title: z.string().min(1, "Informe o título"),
   description: z
      .string()
      .min(5, "Informe a descrição com pelos menos 5 caracteres.")
      .max(140, "A descrição deve ter no máximo 140 caracteres."),
   status: z.enum(["pending", "in_progress", "completed"], 'Status com valor inválido.').optional(),
})

type Props = {
   task?: Task
   setOpen: (open: boolean) => void
}

export const TaskForm = ({ task, setOpen }: Props) => {
   const { getUserTasks } = useTasks()

   const statusOptions: { value: TaskStatus, label: string }[] = [
      { value: 'pending', label: 'Pendente' },
      { value: 'in_progress', label: 'Em Progresso' },
      { value: 'completed', label: 'Concluído' },
   ]

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: "",
         description: "",
         status: "pending",
      },
   })

   const onSubmit = async () => {
      const { title, description, status } = form.getValues()

      const data = {
         title,
         description,
         status: status?.toLocaleUpperCase() as TaskStatus,
      }

      task ? await updateTask(task.id, data) : await newTask(data)
   }

   const newTask = async (task: TaskData) => {
      try {
         const registerTask = await api.post('/tasks', task)

         if (registerTask.status === 201) {
            form.reset()

            setOpen(false)

            toast.success('Tarefa criada com sucesso!')

            getUserTasks()
         }
      } catch (error) {
         console.error('Error creating task:', error)
         toast.error('Erro ao criar a tarefa. Tente novamente.')
      }
   }

   const updateTask = async (taskId: number, task: TaskData) => {
      try {
         const updatedTask = await api.put(`/tasks/${taskId}`, task)
         if (updatedTask.status === 200) {
            form.reset()
            setOpen(false)
            toast.success('Tarefa atualizada com sucesso!')
            getUserTasks()
         }
      } catch (error) {
         console.error('Error updating task:', error)
         toast.error('Erro ao atualizar a tarefa. Tente novamente.')
      }
   }

   const convertTaskStatus = (status: string) => {
      switch (status.toLocaleUpperCase()) {
         case 'PENDING':
            return 'pending'
         case 'IN_PROGRESS':
            return 'in_progress'
         case 'COMPLETED':
            return 'completed'
         default:
            return 'pending'
      }
   }

   useEffect(() => {
      if (task) {
         const statusConverted = convertTaskStatus(task.status)

         console.log(task.status.toLocaleLowerCase() === statusConverted ? 'SIM' : 'NAO')

         form.reset({
            title: task.title,
            description: task.description,
            status: statusConverted,
         })

         console.log(form.getValues('status'))
      }
   }, [task])

   return (
      <Card className="bg-gray-800/10">
         <CardHeader className="hidden">
            <CardTitle className="text-gray-300">Nova tarefa</CardTitle>

            <CardDescription className="text-gray-400">
               Insira os detalhes da sua tarefa aqui.
            </CardDescription>
         </CardHeader>

         <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

               <FieldGroup className="flex md:flex-row gap-4">
                  <Controller
                     name="title"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-full gap-2 md:w-3/5">
                           <FieldLabel htmlFor="title" className="text-gray-300" >
                              Título
                           </FieldLabel>

                           <Input
                              {...field}
                              id="title"
                              aria-invalid={fieldState.invalid}
                              placeholder="Título da tarefa"
                              className={`text-gray-400 placeholder:text-gray-900 `} />

                           {fieldState.invalid && (
                              <FieldError className="text-[12px]" errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />

                  <Controller
                     name="status"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="flex-1 gap-2">
                           <FieldLabel htmlFor="status" className="text-gray-300" >
                              Status
                           </FieldLabel>

                           <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="text-gray-400 font-medium">
                                 <SelectValue placeholder="Status" className="text-blue-800" />
                              </SelectTrigger>

                              <SelectContent className="bg-gray-600">
                                 {statusOptions.map((status) => (
                                    <SelectItem key={status.label} value={status.value} className="text-gray-300 data-[state=checked]:text-blue-400 data-[state=checked]:font-medium">
                                       {status.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {fieldState.invalid && (
                              <FieldError className="text-[12px]" errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />
               </FieldGroup>

               <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description" className="text-gray-300">
                           Descrição
                        </FieldLabel>

                        <InputGroup>
                           <InputGroupTextarea
                              {...field}
                              id="description"
                              placeholder="Descrição da tarefa"
                              rows={6}
                              className="min-h-24 text-gray-400 placeholder:text-gray-900 resize-none"
                              aria-invalid={fieldState.invalid}
                           />
                           <InputGroupAddon align="block-end">
                              <InputGroupText className="tabular-nums">
                                 {field.value.length}/140 characteres
                              </InputGroupText>
                           </InputGroupAddon>
                        </InputGroup>

                        <FieldDescription>

                        </FieldDescription>
                        {fieldState.invalid && (
                           <FieldError errors={[fieldState.error]} />
                        )}
                     </Field>
                  )}
               />

               <FieldGroup className="w-full flex flex-col justify-end gap-4 md:flex-row">
                  <AlertDialogCancel className="flex-1 md:w-auto">
                     <X />
                     Cancelar
                  </AlertDialogCancel>

                  <Button type="submit" className="flex-1 md:w-auto">
                     <Check />
                     Confirmar
                  </Button>
               </FieldGroup>
            </form>
         </CardContent>
      </Card>
   )
}
