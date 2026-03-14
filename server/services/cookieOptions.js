export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// Access token cookie
export const accessTokenOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000,
};

// Refresh token cookie
export const refreshTokenOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
