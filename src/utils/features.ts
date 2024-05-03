import mongoose from "mongoose";
import { InvalidateCacheType, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { nodeCache } from "../app.js";
import { ErrorHandler } from "./utility-class.js";
import { Order } from "../models/order.js";

export const connectDB = async (uri: string) => {
  try {
    const db = await mongoose.connect(uri, {
      dbName: "aura-ecommerce",
    });
    console.log(`database has been connected! : ${db.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export const invalidateCache = async ({
  product,
  admin,
  order,
  userId,
  orderId,
  productId,
}: InvalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "category",
      "admin-products",
    ];
    if (typeof productId === "string") {
      productKeys.push(`product-${productId}`);
    }
    if (typeof productId === "object") {
      productId.forEach((i) => productKeys.push(`product-${i}`));
    }
    nodeCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "admin-orders",
      `orders-${userId}`,
      `singleOrder-${orderId}`,
    ];

    nodeCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const reduceItems = (orderItems: OrderItemType[]) => {
  orderItems.forEach(async (order) => {
    const product = await Product.findById(order.productId);
    if (!product) throw new ErrorHandler("product not found", 404);
    product.sizes.forEach((size, index) => {
      if (size.toLowerCase() === order.size.toLowerCase()) {
        product.stock[index] -= 1;
      }
    });
    await product.save();
  });
};
