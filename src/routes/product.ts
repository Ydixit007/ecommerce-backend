import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { uploadSingleImage } from "../middlewares/multer.js";
import { createNewProduct, getLatestProducts } from "../controllers/product.js";

const productRoute = express.Router();

// route : /api/v1/product/create
productRoute.post("/create", uploadSingleImage, createNewProduct);

// route : /api/v1/user/all
productRoute.get("/latest", getLatestProducts);


export default productRoute;