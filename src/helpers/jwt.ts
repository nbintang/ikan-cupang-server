import { sign, verify } from "hono/jwt";
export type PayloadOpts = {
  id: number;
  email: string;
  isVerified: boolean;
  role: string;
  exp?: number;
};
export const signJWT = async (payload: PayloadOpts) => {
  return await sign(payload, process.env.JWT_SECRET!, "HS256");
};

export const verifyJWT = async (token: string) => {
  return await verify(token, process.env.JWT_SECRET!, "HS256");
};

export const generateAccessToken = async (payload: PayloadOpts) => {
  const opts: PayloadOpts = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 25, // 25 sec
  };
  const accessToken = await signJWT(opts);
  return accessToken;
};

export const generateRefreshToken = async (payload: PayloadOpts) => {
  const opts: PayloadOpts = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, // 1 days
  };
  const refreshToken = await signJWT(opts);
  return refreshToken;
};

export const generateTokens = async (
  payload: PayloadOpts
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  return { accessToken, refreshToken };
};
