import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Error handling logic here
  err.message ||= "Internal server error";
  err.statusCode ||= 500;

  if(err.name === "CastError") err.message = "Invalid Id"

  // Send the error response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
