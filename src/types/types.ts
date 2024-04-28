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

export interface createProductRequestBody {
  productName: string;
  price: number;
  discount?: number;
  sizes: string;
  stock: string;
  category: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;