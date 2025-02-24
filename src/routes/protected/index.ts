import { Hono } from "hono";
import userRoutes from "./user";
import { bearerAuthMiddleware } from "@/middleware/auth";
import { jwt, JwtVariables } from "hono/jwt";
import fishRoutes from "./fish";
import profileRoutes from "./profile";
type Variables = JwtVariables;

const protectedRoutes = new Hono<{ Variables: Variables }>();
protectedRoutes.use("*", jwt({ secret: process.env.JWT_SECRET!}));
protectedRoutes.use("*", bearerAuthMiddleware);
protectedRoutes.route("/users", userRoutes);
protectedRoutes.route("/profile", profileRoutes);
protectedRoutes.route("/fish", fishRoutes)
export default protectedRoutes;
