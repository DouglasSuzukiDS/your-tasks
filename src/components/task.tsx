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

const formSchema = z.object({
   email: z
      .email('Informe um email válido.'),
   description: z
      .string()
      .min(20, "Description must be at least 20 characters.")
      .max(100, "Description must be at most 100 characters."),
})

export default function task() {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         description: "",
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
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <Card className="w-full sm:max-w-md bg-gray-800">
            <CardHeader>
               <CardTitle className="text-gray-300">Identifique-se</CardTitle>

               <CardDescription className="text-gray-400">
                  Para prosseguir, por favor, identifique-se.
               </CardDescription>
            </CardHeader>

            <CardContent>
               <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>

                  <FieldGroup className="gap-4">
                     <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid} className="gap-2">

                              <FieldLabel htmlFor="email" >
                                 Email
                              </FieldLabel>

                              <Input
                                 {...field}
                                 id="email"
                                 aria-invalid={fieldState.invalid}
                                 placeholder="E-mail" />

                              {fieldState.invalid && (
                                 <FieldError className="text-[12px]" errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />

                     <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-rhf-demo-description">
                                 Description
                              </FieldLabel>
                              <InputGroup>
                                 <InputGroupTextarea
                                    {...field}
                                    id="form-rhf-demo-description"
                                    placeholder="I'm having an issue with the login button on mobile."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                 />
                                 <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                       {field.value.length}/100 characters
                                    </InputGroupText>
                                 </InputGroupAddon>
                              </InputGroup>
                              <FieldDescription>
                                 Include steps to reproduce, expected behavior, and what
                                 actually happened.
                              </FieldDescription>
                              {fieldState.invalid && (
                                 <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />
                  </FieldGroup>
               </form>
            </CardContent>

            <CardFooter>
               <Field orientation="horizontal">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                     Reset
                  </Button>
                  <Button type="submit" form="form-rhf-demo">
                     Submit
                  </Button>
               </Field>
            </CardFooter>
         </Card>
      </main>
   )
}
