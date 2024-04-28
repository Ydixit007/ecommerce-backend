import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { uploadSingleImage } from "../middlewares/multer.js";
import { createNewProduct, deleteProduct, getAllProducts, getLatestProducts, getProductCategories, updateProduct } from "../controllers/product.js";
const productRoute = express.Router();
// route : /api/v1/product/create
productRoute.post("/create", adminOnly, uploadSingleImage, createNewProduct);
// route : /api/v1/product/latest
productRoute.get("/all", adminOnly, getAllProducts);
// route : /api/v1/product/latest
productRoute.get("/latest", getLatestProducts);
// route : /api/v1/product/category
productRoute.get("/category", getProductCategories);
// route : /api/v1/product/:id
productRoute.put("/:id", adminOnly, uploadSingleImage, updateProduct);
// route : /api/v1/product/:id
productRoute.delete("/:id", adminOnly, deleteProduct);
export default productRoute;
