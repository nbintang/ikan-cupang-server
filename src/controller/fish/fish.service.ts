import { Context } from "hono";
import {
  createNewFish,
  deleteFishById,
  findFishById,
  findFishes,
  updateFishById,
} from "./fish.repository";
import { HTTPException } from "hono/http-exception";
import { FishSchema } from "@/schemas/fish";
import  {
  updateCloudinaryImages,
  uploadImgToCloudinary,
  removeBgImg
} from "@/helpers";
import { extractPublicId } from "cloudinary-build-url";

export async function getFishes(c: Context) {
  const { page, limit } = c.req.query();
  const pageSizeNum = Number(page) || 1;
  const limitSizeNum = Number(limit) || 10;
  const skip = (pageSizeNum - 1) * limitSizeNum;
  const fishes = await findFishes({ page: skip, limit: limitSizeNum });
  if (!fishes) throw new HTTPException(404, { message: "Fishes Not Found" });
  return c.json({ success: true, data: fishes }, 200);
}

export async function createFish(c: Context, data: FishSchema) {
  const { name, price, stock, description, category, imageUrl } = await data;

  const bgRemovedBuffer = await removeBgImg(imageUrl as File);
  if (!bgRemovedBuffer)
    throw new HTTPException(500, { message: "Failed to remove background" });

  const bufferAsBuffer = Buffer.from(bgRemovedBuffer);

  const { public_id, secure_url } = await uploadImgToCloudinary({
    buffer: bufferAsBuffer,
    folder: "ikan-cupang",
  });

  if (!secure_url) throw new HTTPException(404, { message: "Fish Not Found" });
  const newFish = await createNewFish({
    name,
    price,
    stock,
    description,
    category: {
      connectOrCreate: {
        where: {
          name: category,
        },
        create: {
          name: category,
        },
      },
    },
    imageUrl: secure_url,
  });
  if (!newFish) throw new HTTPException(404, { message: "Fish Not Found" });
  return c.json({ success: true, data: newFish }, 200);
}

export async function getFishById(c: Context) {
  const { id } = c.req.param();
  const fish = await findFishById(Number(id));
  if (!fish) throw new HTTPException(404, { message: "Fish Not Found" });
  return c.json({ success: true, data: fish }, 200);
}

export async function patchFishById(c: Context, data: FishSchema) {
  const { id } = c.req.param();
  const { name, price, stock, description, category, imageUrl } = await data;
  const existedFish = await findFishById(Number(id));
  if (!existedFish || !existedFish.imageUrl)
    throw new HTTPException(404, { message: "Fish Not Found" });
  const publicIdImg = extractPublicId(existedFish.imageUrl);
  const bgRemovedBuffer = await removeBgImg(imageUrl as File);
  if (!bgRemovedBuffer)
    throw new HTTPException(500, { message: "Failed to remove background" });

  const bufferAsBuffer = Buffer.from(bgRemovedBuffer);
  const { secure_url } = await updateCloudinaryImages({
    buffer: bufferAsBuffer,
    folder: "ikan-cupang",
    public_id: publicIdImg,
  });

  if (!secure_url) throw new HTTPException(404, { message: "Fish Not Found" });
  const newFish = await updateFishById(Number(id), {
    name,
    price,
    stock,
    description,
    category: {
      connectOrCreate: {
        where: {
          name: category,
        },
        create: {
          name: category,
        },
      },
    },
    imageUrl: secure_url,
  });
  if (!newFish) throw new HTTPException(404, { message: "Fish Not Found" });

  return c.json({ success: true, data: newFish }, 200);
}

export async function removeFishById(c: Context) {
  const { id } = c.req.param();
  await deleteFishById(Number(id));
  return c.json({ success: true }, 200);
}
