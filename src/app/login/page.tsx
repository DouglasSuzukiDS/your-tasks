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
import { useEffect, useState } from "react"
import { api } from "@/src/lib/axios"
import { redirect } from "next/navigation"
import { getCookieApp, setCookieApp } from "@/src/lib/cookies"

const formSchema = z.object({
   name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
   email: z.email('Informe um email válido.'),
   password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

type Step = 'validateEmail' | 'login' | 'register'

export default function Page() {
   const [step, setStep] = useState<Step>('validateEmail')

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   })

   const handleValidateEmail = async () => {
      const emailField = form.getValues('email')
      const validEmail = await form.trigger('email')

      if (!validEmail) return

      const findEmail = await api.post('/auth/validate', {
         email: emailField
      })

      if (!findEmail.data.exists) return setStep('register')

      return setStep('login')
   }

   const handleLogin = async () => {
      const authenticated = await api.post('/auth/login', {
         email: form.getValues('email'),
         password: form.getValues('password')
      })

      if (authenticated.status !== 200) {
         return toast.error('E-mail ou senha inválidos. Tente novamente.')
      }

      await setCookieApp(authenticated.data.token)

      redirect('/dashboard')
   }

   const handleBack = () => {
      setStep('validateEmail')

      form.setValue('name', '')
      form.setValue('password', '')
   }

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      const register = await api.post('/auth/register', data)

      if (register.status !== 201) {
         return toast.error('Erro ao cadastrar o usuário. Tente novamente.')
      }

      form.setValue('password', '')
      form.setValue('name', '')
      form.setValue('email', '')

      setStep('validateEmail')

      toast.success("Cadastro realizado com sucesso! Agora você pode fazer login.✌️", { className: 'bg-gray-800' })
   }

   const cookie = async () => {
      const hasCookie = await getCookieApp()

      hasCookie && redirect('/dashboard')
   }

   useEffect(() => {
      cookie()
   }, [])
   return (
      <main className="w-full h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
         <Card className="w-full sm:max-w-md bg-gray-800">
            <CardHeader>
               <CardTitle className="text-2xl text-gray-300">Identifique-se</CardTitle>

               <CardDescription className="text-gray-400">
                  {step === 'validateEmail' && 'Para prosseguir, por favor, identifique-se.'}
                  {step === 'login' && 'Ótimo, identificamos seu email! Informe sua senha para continuar.'}
                  {step === 'register' && 'Não identificamos seu email! Para continuar, por favor, cadastre-se.'}
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
                              <FieldLabel htmlFor="email" className="text-gray-300" >
                                 Email
                              </FieldLabel>

                              <Input
                                 {...field}
                                 id="email"
                                 aria-invalid={fieldState.invalid}
                                 placeholder="E-mail"
                                 readOnly={step !== 'validateEmail'}
                                 className={`text-gray-400 placeholder:text-gray-900 ${step !== 'validateEmail' ? 'bg-gray-900' : ''}`} />
                              {fieldState.invalid && (
                                 <FieldError className="text-[12px]" errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />

                     {step === 'login' &&
                        <Controller
                           name="password"
                           control={form.control}
                           render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid} className="gap-2">
                                 <FieldLabel htmlFor="password" className="text-gray-300" >
                                    Senha
                                 </FieldLabel>

                                 <Input
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Senha"
                                    className="text-gray-400 placeholder:text-gray-900" />

                                 {fieldState.invalid && (
                                    <FieldError className="text-[12px]" errors={[fieldState.error]} />
                                 )}
                              </Field>
                           )}
                        />
                     }

                     {step === 'register' && <FieldGroup>
                        <Controller
                           name="name"
                           control={form.control}
                           render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid} className="gap-2">
                                 <FieldLabel htmlFor="name" className="text-gray-300" >
                                    Nome
                                 </FieldLabel>

                                 <Input
                                    {...field}
                                    id="name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Nome"
                                    className="text-gray-400 placeholder:text-gray-900" />

                                 {fieldState.invalid && (
                                    <FieldError className="text-[12px]" errors={[fieldState.error]} />
                                 )}
                              </Field>
                           )}
                        />

                        <Controller
                           name="password"
                           control={form.control}
                           render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid} className="gap-2">
                                 <FieldLabel htmlFor="password" className="text-gray-300" >
                                    Senha
                                 </FieldLabel>

                                 <Input
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Senha"
                                    className="text-gray-400 placeholder:text-gray-900" />

                                 {fieldState.invalid && (
                                    <FieldError className="text-[12px]" errors={[fieldState.error]} />
                                 )}
                              </Field>
                           )}
                        />
                     </ FieldGroup>

                     }
                  </FieldGroup>
               </form>
            </CardContent>


            <CardFooter>
               <Field orientation="horizontal">


                  {step === 'validateEmail' &&
                     <FieldGroup className="flex flex-row justify-end gap-4">
                        <Button
                           className=""
                           onClick={handleValidateEmail}>
                           Avançar
                        </Button>
                     </FieldGroup>
                  }

                  {step !== 'validateEmail' &&
                     <FieldGroup className="flex flex-row justify-end gap-4">
                        <Button variant="outline" onClick={handleBack}>
                           Voltar
                        </Button>

                        {step === 'login' &&
                           <Button onClick={handleLogin}>
                              Logar
                           </Button>
                        }

                        {step === 'register' &&
                           <Button type="submit" form="form-rhf-demo">
                              Cadastrar
                           </Button>
                        }
                     </FieldGroup>
                  }
               </Field>
            </CardFooter>
         </Card>
      </main>
   )
}
