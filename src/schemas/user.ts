import z from "zod";

export const userSchema = z.object({
   id: z.number(),
   name: z.string(),
   email: z.email(),
   password: z.string(),
   createdAt: z.date(),
})