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

export type SearchRequestQuery = {
  search?: string,
  price?: number,
  category?: string,
  sort?: string,
  page?: number,
}

export interface BaseQuery {
  productName?: {
    $regex: string,
    $options: string,
  },
  price?: {
    $lte: number,
  },
  category?: string,
}

export type InvalidateCacheType = {
  product?: boolean,
  order?: boolean,
  admin?: boolean
}