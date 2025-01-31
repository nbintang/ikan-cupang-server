import { Hono } from "hono";
import userRoutes from "./user";
import { bearerAuthMiddleware } from "@/middleware/auth";

const protectedRoutes = new Hono();


protectedRoutes.use("*", bearerAuthMiddleware);
protectedRoutes.route("/user", userRoutes);

export default protectedRoutes;
