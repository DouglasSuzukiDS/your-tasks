import z from "zod"
import { userSchema } from "./user"

export const taskSchema = z.object({
   id: z.number().int(),
   title: z.string(),
   description: z.string(),
   status: z.enum(["pending", "in_progress", "completed"]),
   createdAt: z.date(),
   updatedAt: z.date().optional(),

   userId: z.number(),
   user: userSchema
})

export const updatedTaskSchema = taskSchema.partial().extend({
   title: z.string().optional(),
   description: z.string().optional(),
   status: z.enum(["pending", "in_progress", "completed"], 'Status com valor inválido').optional(),
}) 