import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { nodeCache } from "../app.js";
export const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb://0.0.0.0:27017", {
            dbName: "aura-ecommerce",
        });
        console.log(`database has been connected! : ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
export const invalidateCache = async ({ product, admin, order, }) => {
    if (product) {
        const productKeys = ["latest-products", "category", "admin-products"];
        // get product ids
        const products = await Product.find({}).select("_id");
        products.forEach(product => {
            productKeys.push(`product-${product._id}`);
        });
        nodeCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
