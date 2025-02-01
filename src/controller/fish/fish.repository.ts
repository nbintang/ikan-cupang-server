import db from "@/lib/db";
import { PaginationProps } from "@/types";
import { Prisma } from "@prisma/client";
const selections: Prisma.FishSelect = {
  id: true,
  name: true,
  imageUrl: true,
  price: true,
  stock: true,
  description: true,
  category: {
    select: {
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
export const findFishes = async ({ page, limit }: PaginationProps) => {
  const fishes = await db.fish.findMany({
    select: selections,
    skip: page,
    take: limit,
  });
  return fishes.map((fish) => ({
    ...fish,
    category: fish.category.name,
  }));
};

export const createNewFish = async (data: Prisma.FishCreateInput) => {
  const newFish = await db.fish.create({ data, select: selections });
  return newFish;
};

export const findFishById = async (id: number) => {
  const fish = await db.fish.findUniqueOrThrow({
    where: { id },
    select: selections,
  });
  return Object.assign(fish, { category: fish.category.name });
};

export const updateFishById = async (
  id: number,
  data: Prisma.FishUpdateInput
) => {
  const updatedFish = await db.fish.update({
    where: { id },
    data,
    select: selections,
  });
  return updatedFish;
};

export const deleteFishById = async (id: number) => {
  const fish = await findFishById(id);
  if (!fish) throw new Error("Fish Not Found");
  return await db.fish.delete({ where: { id: fish.id } });
};
