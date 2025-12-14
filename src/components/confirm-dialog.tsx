import { redirect } from "next/navigation"
import { deleteCookieApp } from "../lib/cookies"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Check, LogOut, X } from "lucide-react"
import { ReactNode } from "react"
import { Label } from "@radix-ui/react-dropdown-menu"

type Props = {
   label: string
   iconLabel?: ReactNode
   title: string
   description: string
   onConfirm: () => void
}
export const ConfirmDialog = ({ label, iconLabel, title, description, onConfirm }: Props) => {

   return (
      <AlertDialog>
         <AlertDialogTrigger className="px-2 py-3">
            <Label className="flex items-center text-gray-400 text-sm gap-2 cursor-pointer">
               {iconLabel}
               {label}
            </Label>
         </AlertDialogTrigger>

         <AlertDialogContent className="bg-gray-800">
            <AlertDialogHeader>
               <AlertDialogTitle className="text-gray-300">{title}</AlertDialogTitle>

               <AlertDialogDescription className="text-gray-400">
                  {description}
               </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>
               <AlertDialogCancel>
                  <X />
                  Cancelar
               </AlertDialogCancel>

               <AlertDialogAction onClick={onConfirm}>
                  <Check />
                  Confirmar
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}