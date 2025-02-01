import { Context } from "hono";
import {
  createToken,
  deleteAllTokensByUserEmail,
  findTokenByUserEmail,
  findUserByEmail,
  updateVerifiedUser,
} from "./auth.repository";
import { HTTPException } from "hono/http-exception";
import sendTokenThroughEmail from "@/lib/mail";
import {
  generateAccessToken,
  generateOtps,
  generateTokens,
  verifyJWT,
  hashToken,
  verifyHashedToken,
} from "@/helpers";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export async function loginServices(c: Context) {
  const { email } = await c.req.json();
  const { otp, expiresAt } = generateOtps();
  const hashedToken = await hashToken(otp);

  const token = await createToken({
    token: hashedToken,
    user: {
      connectOrCreate: {
        where: {
          email: email,
        },
        create: {
          email: email,
          name: email.split("@")[0],
        },
      },
    },
    expiresAt,
  });
  if (!token)
    throw new HTTPException(500, { message: "Internal Server Error" });

  await sendTokenThroughEmail({
    to: email,
    subject: "Login OTP",
    text: `Your OTP is ${otp}`,
  });
  return c.json(
    {
      success: true,
      message: "OTP sent successfully, check your email",
    },
    200
  );
}

export async function verifyOtp(c: Context) {
  const { token, email } = await c.req.json();

  const existedUser = await findUserByEmail(email);
  if (!existedUser)
    throw new HTTPException(404, {
      message: "User Not Found, Please Insert the correct email",
    });

  const existedToken = await findTokenByUserEmail(existedUser.email);
  if (!existedToken)
    throw new HTTPException(404, { message: "Token Not Found" });

  const isExpiredToken = new Date(existedToken.expiresAt) < new Date();
  if (isExpiredToken)
    throw new HTTPException(401, { message: "Token Expired" });

  const isValidToken = await verifyHashedToken(token, existedToken.token);
  if (!isValidToken) throw new HTTPException(401, { message: "Invalid Token" });

  await updateVerifiedUser(existedUser.email);
  await deleteAllTokensByUserEmail(existedUser.email);

  const { accessToken, refreshToken } = await generateTokens({
    id: existedUser.id,
    isVerified: existedUser.isVerified,
    role: existedUser.role,
  });
  if (accessToken && refreshToken)
    setCookie(c, "refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 1,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });

  return c.json(
    { success: true, message: "User Verified Successfully", accessToken },
    200
  );
}

export async function resendOtp(c: Context) {
  const { email } = await c.req.json();
  const user = await findUserByEmail(email);
  if (!user) throw new HTTPException(404, { message: "User Not Found" });
  await deleteAllTokensByUserEmail(user.email);

  const { otp, expiresAt } = generateOtps();
  const hashedToken = await hashToken(otp);
  const token = await createToken({
    token: hashedToken,
    user: {
      connectOrCreate: {
        where: {
          email: email,
        },
        create: {
          email: email,
          name: email.split("@")[0],
        },
      },
    },
    expiresAt,
  });

  if (!token)
    throw new HTTPException(500, { message: "Internal Server Error" });

  await sendTokenThroughEmail({
    to: email,
    subject: "Resend OTP",
    text: `Your OTP is ${otp}`,
  });

  return c.json(
    {
      success: true,
      message: "OTP sent successfully, check your email",
    },
    200
  );
}

export async function refreshToken(c: Context) {
  try {
    const refreshToken = getCookie(c, "refreshToken");
    if (!refreshToken)
      throw new HTTPException(401, { message: "Unauthorized" });
    const payload = await verifyJWT(refreshToken);
    if (!payload) throw new HTTPException(401, { message: "Unauthorized" });

    const accessToken = await generateAccessToken({
      id: payload.id,
      isVerified: payload.isVerified,
      role: payload.role,
    });

    return c.json({ accessToken }, 200);
  } catch (error) {
    deleteCookie(c, "refreshToken");
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
}

export async function logout(c: Context) {
  deleteCookie(c, "refreshToken");
  return c.json({ success: true, message: "Logged Out Successfully" }, 200);
}
