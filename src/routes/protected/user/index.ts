import {
  getUserById,
  getUsers,
  patchUserById,
  removeUserById,
} from "@/controller/user";
import {customZodValidator} from "@/helpers";
import { userSchema } from "@/schemas/user";
import { Hono } from "hono";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.patch("/:id", customZodValidator("json", userSchema), patchUserById);
userRoutes.delete("/:id", removeUserById);
export default userRoutes;
