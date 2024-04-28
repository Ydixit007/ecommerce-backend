import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
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
// revalidate cache on new order and on new product creation
// Controller for latest products
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    // checking if cache already has the data.
    if (nodeCache.has("latest-products"))
        // getting the data from cache.
        products = JSON.parse(nodeCache.get("latest-products"));
    else {
        products = await Product.find({}).sort().limit(5);
        // storing data in cache for future
        nodeCache.set("latest-products", JSON.stringify(products));
    }
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
        message: "The product has been deleted successfully!",
    });
});
// get all products with filters
export const getAllProductsWithFilters = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    // if searching by search query
    if (search)
        baseQuery.productName = {
            $regex: search,
            $options: "i",
        };
    // if searching by price
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    // if searching by category
    if (category)
        baseQuery.category = category;
    // applying filters and sorting and pagination, running both awaits together using Promise.all()
    // products has porducts with filters and sorting
    // allProducts will be used for calculating the length for pagination based on filters
    const [products, allProducts] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip),
        Product.find(baseQuery),
    ]);
    // get the total number of pages in applied products.
    const totalPages = Math.ceil(allProducts.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPages,
    });
});
