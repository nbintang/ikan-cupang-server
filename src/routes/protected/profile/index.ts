import { getCurrentUserProfile, patchCurrentUserProfile } from "@/controller/user/user.service";
import { Hono } from "hono";

const profileRoutes = new Hono();


profileRoutes.get("/", getCurrentUserProfile);
profileRoutes.patch("/", patchCurrentUserProfile);

export default profileRoutes;