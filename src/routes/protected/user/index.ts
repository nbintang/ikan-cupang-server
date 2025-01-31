import { Hono } from "hono";

const userRoutes = new Hono();

userRoutes.get("/", (c) => {
    return c.text("Hello User!");
});

export default userRoutes;