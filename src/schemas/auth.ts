import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export const otpSchema = z.object({
  email: z.string().email(),
  token: z
    .string()
    .min(4, { message: "OTP must be at least 4 characters" })
    .refine((val) => !Number.isNaN(parseInt(val)), {
      message: "Expected number, received a string",
    })
});
