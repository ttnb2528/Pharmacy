import jwt from "jsonwebtoken";

const generateToken = (res, userId, isAdmin = false) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieName = isAdmin ? "jwt_admin" : "jwt_client";

  // Set JWT as an HTTP-Only Cookie
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};

export default generateToken;
