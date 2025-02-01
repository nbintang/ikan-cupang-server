import { Context, Hono } from "hono";
import { html } from "hono/html";
import authRoutes from "./auth";
import protectedRoutes from "./protected";
import { refreshToken } from "@/controller/auth";
const mainRoutes = new Hono();
mainRoutes.get("/", (c) => {
  return c.text("Hello Hono!");
});
mainRoutes.post("/refresh-token", refreshToken );
mainRoutes.route("/auth", authRoutes);
mainRoutes.route("/protected", protectedRoutes);
export default mainRoutes;
export const introductions = (c: Context) => {
  const payload = {
    message: "See Our API through Here!",
  };
  const url = "/api/auth/login";
  return c.html(
    html`<html>
      <head>
        <title>Hello Hono!</title>
      </head>
      <body
        style="display: flex; align-items: center; justify-content: center; height: 100vh;"
      >
        <a
          href="${url}"
          style="color: white; background-color: black; text-decoration: none; padding: 10px; border-radius: 5px; "
          >${payload.message}</a
        >
      </body>
    </html>`
  );
};
