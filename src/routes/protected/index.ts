import { Hono } from "hono";
import userRoutes from "./user";
import { bearerAuthMiddleware } from "@/middleware/auth";
import { csrf } from "hono/csrf";
import { jwt, JwtVariables } from "hono/jwt";
import { getCurrentUserProfile } from "@/controller/user/user.service";
type Variables = JwtVariables;

const protectedRoutes = new Hono<{ Variables: Variables }>();
protectedRoutes.use("*", jwt({ secret: process.env.JWT_SECRET!}));
protectedRoutes.use("*", bearerAuthMiddleware);
protectedRoutes.route("/users", userRoutes);
protectedRoutes.route("/profile", protectedRoutes);

export default protectedRoutes;
