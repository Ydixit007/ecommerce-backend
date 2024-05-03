import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { nodeCache } from "../app.js";
import { ErrorHandler } from "./utility-class.js";
export const connectDB = async (uri) => {
    try {
        const db = await mongoose.connect(uri, {
            dbName: "aura-ecommerce",
        });
        console.log(`database has been connected! : ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
export const invalidateCache = async ({ product, admin, order, userId, orderId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "category",
            "admin-products",
        ];
        // get product ids
        const products = await Product.find({}).select("_id");
        products.forEach((product) => {
            productKeys.push(`product-${product._id}`);
        });
        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "admin-orders",
            `orders-${userId}`,
            `singleOrder-${orderId}`
        ];
        nodeCache.del(orderKeys);
    }
    if (admin) {
    }
};
export const reduceItems = (orderItems) => {
    orderItems.forEach(async (order) => {
        const product = await Product.findById(order.productId);
        if (!product)
            throw new ErrorHandler("product not found", 404);
        product.sizes.forEach((size, index) => {
            if (size.toLowerCase() === order.size.toLowerCase()) {
                product.stock[index] -= 1;
            }
        });
        await product.save();
    });
};
