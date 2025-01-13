import { z } from 'zod';

export const formSchema = z.object({
    name: z.string().min(2, {message: 'Name must be at least 2 characters long '}).max(50),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, { message:'Password must be at least 6 characters'}).max(255),
})

export  const SignInFormSchema = formSchema.pick({
    email: true,
    password: true,
})