import { createFish, getFishById, getFishes, patchFishById, removeFishById } from "@/controller/fish";
import customZodValidator from "@/helpers/customZodValidator";
import { fishSchema } from "@/schemas/fish";
import { Hono } from "hono";

const fishRoutes = new Hono();

fishRoutes.get("/", getFishes);

fishRoutes.get("/:id", getFishById)
fishRoutes.post("/", customZodValidator("form", fishSchema), async (c) => {
  const data = await c.req.valid("form");
  return await createFish(c, data);
});
fishRoutes.patch("/:id", customZodValidator("form", fishSchema), async (c) => {
    const data = await c.req.valid("form");
    return await patchFishById(c, data);
})
fishRoutes.delete("/:id", removeFishById )
export default fishRoutes;
