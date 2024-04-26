import { NextFunction, Request, Response } from "express";

export interface createUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  gender: string;
  dob: Date;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<void, Record<string, any>> | undefined>;