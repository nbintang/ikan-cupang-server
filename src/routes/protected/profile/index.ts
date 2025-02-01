import { getCurrentUserProfile, patchCurrentUserProfile } from "@/controller/user";
import customZodValidator from "@/helpers/customZodValidator";
import { userSchema } from "@/schemas/user";
import { Hono } from "hono";

const profileRoutes = new Hono();


profileRoutes.get("/", getCurrentUserProfile);
profileRoutes.patch("/",customZodValidator("json", userSchema), patchCurrentUserProfile);

export default profileRoutes;