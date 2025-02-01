import {  getUserById, getUsers, patchUserById, removeUserById } from "@/controller/user/user.service";
import { userSchema } from "@/schemas/user";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.patch("/:id", zValidator("json", userSchema), patchUserById);
userRoutes.delete("/:id", removeUserById);
export default userRoutes;
