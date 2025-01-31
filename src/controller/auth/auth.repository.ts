import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export const findUserByEmail = async (email: string) => {
  const user = await db.user.findUniqueOrThrow({
    where: { email },
    select: { id: true, email: true, isVerified: true, role: true },
  });
  return user;
};

export const findTokenByUserEmail = async (email: string) => {
  const token = await db.verificationToken.findFirstOrThrow({
    where: {
      user: {
        email,
      },
    },
    select: {
      token: true,
      expiresAt: true,
    },
  });
  return token;
};

export const createToken = async (
  data: Prisma.VerificationTokenCreateInput
) => {
  const token = await db.verificationToken.create({ data });
  return token;
};

export const updateVerifiedUser = async (email: string) => {
  const user = await db.user.update({
    where: { email },
    data: { isVerified: true },
    select: { id: true, email: true, isVerified: true },
  });
  return user;
};

export const deleteAllTokensByUserEmail = async (email: string) => {
  const token = await db.verificationToken.deleteMany({
    where: {
      user: { email },
    },
  });
  return token;
};
