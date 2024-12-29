import jwt from "jsonwebtoken";
import Account from "../model/Account.model.js";
import Staff from "../model/Staff.model.js";
import asyncHandler from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Account.findById(decoded.userId).select("-password");
      if (!req.user) {
        req.user = await Staff.findById(decoded.userId).select("-password");
      }

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorize, invalid user.");
      }

      console.log(req.user);

      next();
    } catch (error) {
      res.status(401);
      console.log(error);

      throw new Error("Not authorize, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorize, no token.");
  }
});

export const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin.");
  }
});

export const authorize = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.isAdmin || !req.user.isAdmin)) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized.");
  }
});
