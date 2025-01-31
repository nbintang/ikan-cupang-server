import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, otpSchema } from "@/schemas/auth";
import {
  loginServices,
  refreshToken,
  resendOtp,
  verifyOtp,
} from "@/controller/auth";
const authRoutes = new Hono();

authRoutes.post("/login", zValidator("json", loginSchema), loginServices);
authRoutes.post("/verify-otp", zValidator("json", otpSchema), verifyOtp);
authRoutes.post("/resend-otp", zValidator("json", loginSchema), resendOtp);
authRoutes.post("/refresh-token", refreshToken);
export default authRoutes;
