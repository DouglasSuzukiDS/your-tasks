import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Check, X } from "lucide-react"
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
         <AlertDialogTrigger className="px-3 py-2 rounded-md border border-gray-700 hover:bg-gray-700">
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
               <AlertDialogCancel className="flex-1 text-gray-300 p-2 rounded-md border border-gray-700 bg-gray-500 hover:text-gray-300  hover:bg-gray-600">
                  <X />
                  Cancelar
               </AlertDialogCancel>

               <AlertDialogAction
                  className="flex-1 flex justify-center items-center text-gray-300 gap-2 px-3 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600"
                  onClick={onConfirm}>
                  <Check />
                  Confirmar
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}