import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { createProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { rm } from "fs";

export const createNewProduct = TryCatch(
  async (
    req: Request<{}, {}, createProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { productName, price, discount, sizes, stock, category } = req.body;
    const productImage = req.file;

    // standard checks for null safety.
    if (!productImage) return next(new ErrorHandler("Add product image", 400));
    if (!productName || !price || !discount || !sizes || !stock || !category) {
      // delete image if any data is missing.
      rm(productImage.path, () => {
        console.log("Image deleted!");
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    // creating product here.
    await Product.create({
      productName,
      productImage: productImage.path,
      price,
      sizes: sizes.split(","),
      stock: stock.split(","),
      discount,
      category: category.toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: "product created successfully",
    });
  }
);

export const getLatestProducts = TryCatch(async (req, res, next)=>{
  const products = await Product.find({}).sort().limit(5);

  return res.status(200).json({
    success: true,
    products
  });
});