import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { rm } from "fs";
// Controller for creating new product
export const createNewProduct = TryCatch(async (req, res, next) => {
    const { productName, price, discount, sizes, stock, category } = req.body;
    const productImage = req.file;
    // standard checks for null safety.
    if (!productImage)
        return next(new ErrorHandler("Add product image", 400));
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
});
// Controller for latest products
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort().limit(5);
    return res.status(200).json({
        success: true,
        products,
    });
});
// get all products for admin
export const getAllProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products,
    });
});
// get single product from id.
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("product not found", 400));
    return res.status(200).json({
        success: true,
        product,
    });
});
// Controller for getting product categories
export const getProductCategories = TryCatch(async (req, res, next) => {
    const category = [
        {
            men: ["shirts", "tshirts", "jeans", "trousers", "shoes"],
            women: ["dresses", "tshirts", "skirts", "jeans", "heels"],
        },
    ];
    // const category = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        category,
    });
});
// Controller for updating an existing product
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { productName, price, discount, sizes, stock, category } = req.body;
    const productImage = req.file;
    const product = await Product.findById(id);
    // standard checks for null safety.
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    // if request contains new image
    if (productImage) {
        // delete old image and replaing with new.
        rm(product.productImage, () => {
            console.log("old Image deleted!");
        });
        product.productImage = productImage.path;
    }
    // check for available data and updating it accordingly.
    if (productName)
        product.productName = productName;
    if (price)
        product.price = price;
    if (discount)
        product.discount = discount;
    if (sizes)
        product.sizes = sizes.split(",");
    if (stock)
        product.stock = stock.split(",");
    if (category)
        product.category = category.toLowerCase();
    // saving the updated changes.
    await product.save();
    return res.status(200).json({
        success: true,
        message: "product updated successfully",
    });
});
// Controller for deleting product
export const deleteProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    // checking if id is present in req.
    if (!id)
        return next(new ErrorHandler("Invalid id", 404));
    const product = await Product.findById(id);
    // checking if product actually exists.
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    rm(product.productImage, () => {
        console.log("Product image deleted!");
    });
    // deleting product from database.
    await product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "The product has been deleted successfully!"
    });
});
