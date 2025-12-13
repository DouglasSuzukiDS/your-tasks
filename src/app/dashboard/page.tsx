'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Task } from "@/generated/prisma/client"
import { api } from "@/src/lib/axios"
import { deleteCookieApp } from "@/src/lib/cookies"
import { StatusOptions } from "@/src/types/status-options"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, LogOut, PlusIcon, X } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea, } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import z from "zod"

const formSchema = z.object({
   title: z.string().min(1, "Informe o título"),
   description: z
      .string()
      .min(5, "Informe a descrição com pelos menos 5 caracteres.")
      .max(140, "A descrição deve ter no máximo 140 caracteres."),
   status: z.enum(["pending", "in_progress", "completed"]).optional(),
})

export default function Dashboard() {
   const [tasks, setTasks] = useState<Task[]>([])

   const formRef = useRef<HTMLFormElement>(null)

   const statusOptions: { value: StatusOptions, label: string }[] = [
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

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      const task = {
         title: data.title,
         description: data.description,
         status: data.status,
      }

      const newTask = await api.post('/tasks', task)

      if (newTask.status === 201) {
         toast.success('Tarefa criada com sucesso!')
      }

      getUserTasks()
   }

   useEffect(() => {
      getUserTasks()
   }, [])

   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <div className="flex justify-center items-center gap-4 border flex-col">
            <div className="flex justify-between items-center gap-4 w-full mb-4">
               <h1 className="text-white text-3xl">Suas Tarefas</h1>

               <AlertDialog>
                  <AlertDialogTrigger data-variant="destructive" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 has-[>svg]:px-3">
                     <PlusIcon className="text-sm" />
                     Nova tarefa
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-gray-800">
                     <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-300">Nova tarefa</AlertDialogTitle>

                        <AlertDialogDescription className="text-gray-400">
                           Insira os detalhes da sua nova tarefa aqui.

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
                                                   <SelectTrigger className="">
                                                      <SelectValue placeholder="Status" className="text-blue-800" />
                                                   </SelectTrigger>

                                                   <SelectContent className="bg-gray-600">
                                                      {statusOptions.map((status) => (
                                                         <SelectItem key={status.label} value={status.value} className="text-gray-300">
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

                                    <FieldGroup className="flex justify-end gap-4 md:flex-row">
                                       <AlertDialogCancel>
                                          <X />
                                          Cancelar
                                       </AlertDialogCancel>

                                       <Button type="submit">
                                          <Check />
                                          Confirmar
                                       </Button>
                                    </FieldGroup>
                                 </form>
                              </CardContent>
                           </Card>


                        </AlertDialogDescription>

                     </AlertDialogHeader>


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

            <p>
               {tasks.length}
            </p>
         </div>



      </main>
   )
}