import jwt from "jsonwebtoken";
import Account from "../model/Account.model.js";
import Staff from "../model/Staff.model.js";
import asyncHandler from "./asyncHandler.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";

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
        return res.json(
          jsonGenerate(StatusCode.UNAUTHORIZED, "Not authorize, invalid user.")
        );
      }

      next();
    } catch (error) {
      return res.json(
        jsonGenerate(StatusCode.UNAUTHORIZED, "Not authorize, token failed.")
      );
    }
  } else {
    return res.json(
      jsonGenerate(StatusCode.UNAUTHORIZED, "Not authorize, no token.")
    );
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
