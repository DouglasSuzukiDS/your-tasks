import { redirect } from "next/navigation"
import { deleteCookieApp } from "../lib/cookies"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Check, LogOut, X } from "lucide-react"

export const LogoutDialog = () => {
   const handleLogout = async () => {
      await deleteCookieApp()

      redirect('/login')
   }

   return (
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
   )
}