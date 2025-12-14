"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { api } from "@/src/lib/axios"
import { cookie, setCookieApp } from "@/src/lib/cookies"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

const formSchema = z.object({
   name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
   email: z.email('Informe um email válido.'),
   password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

type Step = 'validateEmail' | 'login' | 'register'

export default function Page() {
   const router = useRouter()
   const [step, setStep] = useState<Step>('validateEmail')
   const [showPassword, setShowPassword] = useState(false)

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   })

   const handleValidateEmail = async () => {
      const emailField = form.getValues('email').toLocaleLowerCase()
      const validEmail = await form.trigger('email')

      if (!validEmail) return

      const findEmail = await api.post('/auth/validate', {
         email: emailField
      })

      if (!findEmail.data.exists) return setStep('register')

      return setStep('login')
   }

   const handleLogin = async () => {
      const { email, password } = form.getValues()

      try {
         const authenticated = await api.post('/auth/login', {
            email: email.toLocaleLowerCase(),
            password
         })

         if (authenticated.status === 200) {
            // return toast.error('E-mail ou senha inválidos. Tente novamente.')
            await setCookieApp(authenticated.data.token)
         }

         console.log('authenticated', authenticated)

         router.push('/dashboard')
      } catch (error) {
         console.log(error)
         toast.error('E-mail ou senha inválidos. Error')
      }
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
               <form>
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

                                 <FieldLabel
                                    className="border rounded-md pr-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors color">
                                    <Input
                                       {...field}
                                       id="password"
                                       type={showPassword ? 'text' : 'password'}
                                       aria-invalid={fieldState.invalid}
                                       placeholder="Senha"
                                       className="text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none border-none"
                                    />
                                    {showPassword ?
                                       <EyeOff
                                          className="text-gray-400"
                                          onClick={() => setShowPassword(!showPassword)} /> :
                                       <Eye
                                          className="text-gray-400"
                                          onClick={() => setShowPassword(!showPassword)} />}
                                 </FieldLabel>

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

                                 <FieldLabel
                                    className="border rounded-md pr-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors color">
                                    <Input
                                       {...field}
                                       id="password"
                                       type={showPassword ? 'text' : 'password'}
                                       aria-invalid={fieldState.invalid}
                                       placeholder="Senha"
                                       className="text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none border-none"
                                    />
                                    {showPassword ?
                                       <EyeOff
                                          className="text-gray-400"
                                          onClick={() => setShowPassword(!showPassword)} /> :
                                       <Eye
                                          className="text-gray-400"
                                          onClick={() => setShowPassword(!showPassword)} />}
                                 </FieldLabel>

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
                           className="flex-1 md:w-1/3flex justify-center items-center text-gray-300 gap-2 px-3 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600"
                           onClick={handleValidateEmail}>
                           Avançar
                        </Button>
                     </FieldGroup>
                  }

                  {step !== 'validateEmail' &&
                     <FieldGroup className="flex flex-row justify-end gap-4">
                        <Button
                           className="flex-1 md:w-1/3 text-gray-300 p-2 rounded-md border border-gray-700 bg-gray-500 hover:text-gray-300  hover:bg-gray-600"
                           onClick={handleBack}>
                           Voltar
                        </Button>

                        {step === 'login' &&
                           <Button
                              className="flex-1 md:w-1/3 justify-center items-center text-gray-300 gap-2 px-3 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600"
                              onClick={handleLogin}>
                              Logar
                           </Button>
                        }

                        {step === 'register' &&
                           <Button
                              className="flex-1 md:w-1/3 flex justify-center items-center text-gray-300 gap-2 px-3 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600"
                              onClick={form.handleSubmit(onSubmit)}>
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
