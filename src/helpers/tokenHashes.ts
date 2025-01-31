export const hashToken = async (token: string) => {
  const hashedToken = await Bun.password.hash(token, {
    algorithm: "bcrypt",
    cost: 10,
  });
  return hashedToken;
};

export const verifyHashedToken = async (token: string, hashedToken: string) => {
  const isValid = await Bun.password.verify(token, hashedToken);
  return isValid;
};
