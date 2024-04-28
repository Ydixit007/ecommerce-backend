import { NextFunction, Request, Response } from "express";
import { TryCatch } from "./error.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { User } from "../models/user.js";

// middleware for admin access routes
export const adminOnly = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (!id)
      return next(
        new ErrorHandler("Please login first to access this route!", 401)
      );
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("user not found", 404));
    if (user.role !== "admin")
      return next(new ErrorHandler("you do not have admin privilege", 401));
    next();
  }
);
