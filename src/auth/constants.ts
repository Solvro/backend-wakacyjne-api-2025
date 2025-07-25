export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const bcryptConstants = {
  rounds: Number.isNaN(Number(process.env.BCRYPT_ROUNDS))
    ? 10
    : Number(process.env.BCRYPT_ROUNDS),
};
