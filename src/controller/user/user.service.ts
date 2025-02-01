import { Context } from "hono";
import { deleteUserById, findUserById, findUsers, updateUserById } from "./user.repository";
import { HTTPException } from "hono/http-exception";

export async function getUsers(c: Context) {
  const { page, limit } = c.req.query();
  const pageSizeNum = Number(page) || 1;
  const limitSizeNum = Number(limit) || 10;
  const skip = (pageSizeNum - 1) * limitSizeNum;
  const users = await findUsers({ page: skip, limit: limitSizeNum });
  if (!users) throw new HTTPException(404, { message: "Users Not Found" });
  return c.json({ success: true, data: users }, 200);
}

export async function getUserById(c: Context) {
  const { id } = c.req.param();
  const user = await findUserById(Number(id), {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  });
  if (!user) throw new HTTPException(404, { message: "User Not Found" });
  return c.json({ success: true, data: user }, 200);
}

export async function getCurrentUserProfile(c: Context) {
  const payload = c.get("jwtPayload");
  if (!payload) throw new HTTPException(401, { message: "Unauthorized" });
  const user = await findUserById(Number(payload.id), {
    id: true,
    name: true,
    email: true,
    isVerified: true,
    createdAt: true,
    updatedAt: true,
  });
  if (!user) throw new HTTPException(404, { message: "User Not Found" });
  return c.json({ success: true, data: user }, 200);
}


export async function patchUserById(c: Context){
    const {id} = c.req.param();
    const { name, email,} = await c.req.json();
    const user = await updateUserById(Number(id), {name, email});
    if (!user) throw new HTTPException(404, { message: "User Not Found" });
    return c.json({success: true, data: user}, 200);
}


export async function patchCurrentUserProfile(c: Context){
    const payload = c.get("jwtPayload");
    if (!payload) throw new HTTPException(401, { message: "Unauthorized" });
    const { name, email,} = await c.req.json();
    const user = await updateUserById(Number(payload.id), {name, email});
    if (!user) throw new HTTPException(404, { message: "User Not Found" });
    return c.json({success: true, data: user}, 200);
}


export async function removeUserById(c: Context) {
  const { id } = c.req.param();
  await deleteUserById(Number(id));
  return c.json({ success: true }, 200);
}






