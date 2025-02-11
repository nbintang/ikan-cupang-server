import { Context, Hono } from "hono";
import authRoutes from "./auth";
import protectedRoutes from "./protected";
import { refreshToken } from "@/controller/auth";
const mainRoutes = new Hono();
mainRoutes.get("/", (c) => {
  return c.text("Hello Hono!");
});
mainRoutes.route("/auth", authRoutes);
mainRoutes.route("/protected", protectedRoutes);
export default mainRoutes;
export const introductions = (c: Context) => {
  const payload = {
    message: "See Our API through Here!",
  };
  const url = "/api";
  return c.json(payload, 200);
};
