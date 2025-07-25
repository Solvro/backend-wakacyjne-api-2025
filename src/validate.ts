export function validate(config: Record<string, unknown>) {
  if (
    config.DATABASE_URL === undefined ||
    config.JWT_SECRET === undefined ||
    config.BCRYPT_ROUNDS === undefined
  ) {
    throw new Error("Environment variables not initialized");
  }

  return config;
}
