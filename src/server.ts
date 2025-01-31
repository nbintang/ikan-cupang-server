import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import mainRoutes, { introductions } from "@/routes";
const app = new Hono();

app.use(logger()); 
app.use("/api/*", cors({ origin: "http://localhost:3000" }));
app.get("/", introductions);

app.route("/api", mainRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
