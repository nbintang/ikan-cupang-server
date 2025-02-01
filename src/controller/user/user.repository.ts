import db from "@/lib/db";
import { Prisma } from "@prisma/client";
type PaginationProps = { page: number; limit: number };
export const findUsers = async ({ page, limit }: PaginationProps) =>
  await db.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    skip: page,
    take: limit,
  });

export const findUserById = async (id: number, select: Prisma.UserSelect) =>
  await db.user.findUniqueOrThrow({
    where: { id },
    select,
  });

export const updateUserById = async (id: number, data: Prisma.UserUpdateInput) => {
  const user = await findUserById(id, { id: true });
  if(!user) throw new Error("User Not Found");
 return await db.user.update({ where: { id: user.id }, data, select:{
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
 } });
};


export const deleteUserById = async (id: number) => {
  const user = await findUserById(id, { id: true });
  if(!user) throw new Error("User Not Found");
  return await db.user.delete({ where: { id: user.id } });
}