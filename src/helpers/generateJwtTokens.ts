import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const signJWT = async (payload: JWTPayload) => {
  return await sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET!,
    "HS256"
  );
};

export const verifyJWT = async (token: string) => {
  return await verify(token, process.env.JWT_SECRET!, "HS256");
};

export const generateAccessToken = async (payload: JWTPayload) => {
  const opts: JWTPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 30, 
  };
  const accessToken = await signJWT(opts);
  return accessToken;
};

export const generateRefreshToken = async (payload: JWTPayload) => {
  const opts: JWTPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, 
  };
  const refreshToken = await signJWT(opts);
  return refreshToken;
};

export const generateTokens = async (
  payload: JWTPayload
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  return { accessToken, refreshToken };
};
