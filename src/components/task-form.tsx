"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea, } from "@/components/ui/input-group"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectContent, SelectItem } from "@radix-ui/react-select"
import { StatusOptions } from "../types/status-options"

const formSchema = z.object({
   title: z.string().min(1, "Informe o título"),
   description: z
      .string()
      .min(5, "Informe a descrição com pelos menos 5 caracteres.")
      .max(140, "A descrição deve ter no máximo 140 caracteres."),
   status: z.enum(["pending", "in_progress", "completed"]).optional(),
})

export const TaskForm = () => {
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

   function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
         description: (
            <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
               <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
         position: "bottom-right",
         classNames: {
            content: "flex flex-col gap-2",
         },
         style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
         } as React.CSSProperties,
      })
   }

   return (
      <Card className="bg-gray-800/10">
         <CardHeader className="hidden">
            <CardTitle className="text-gray-300">Nova tarefa</CardTitle>

            <CardDescription className="text-gray-400">
               Insira os detalhes da sua tarefa aqui.
            </CardDescription>
         </CardHeader>

         <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

               <FieldGroup className="flex md:flex-row gap-4">
                  <Controller
                     name="title"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-2 w-3/5">
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
                              <SelectTrigger className="w-45">
                                 <SelectValue placeholder="Status" />
                              </SelectTrigger>

                              <SelectContent className="w-full bg-red-500">
                                 {statusOptions.map((status) => (
                                    <SelectItem key={status.label} value={status.value}>
                                       {status.label.charAt(0).toUpperCase() + status.label.slice(1).replace('-', ' ')}
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
            </form>
         </CardContent>
      </Card>
   )
}
