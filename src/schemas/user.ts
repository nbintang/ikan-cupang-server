import * as z from "zod";
export const userSchema = z.object({
    name: z.string().min(5, { message: "Name must be at least 5 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
})