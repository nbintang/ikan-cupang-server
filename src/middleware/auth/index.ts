import { verifyJWT } from "@/helpers/jwt";
import { bearerAuth } from "hono/bearer-auth";

export const bearerAuthMiddleware = bearerAuth({
  verifyToken: async (token) => {
    try {
      const decoded = await verifyJWT(token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  },
});
