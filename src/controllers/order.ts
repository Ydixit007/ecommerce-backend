import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { createOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceItems } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

export const createNewOrder = TryCatch(
  async (
    req: Request<{}, {}, createOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      total,
      trackingLink,
      discount,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      !shippingCharges ||
      !total ||
      !trackingLink
    ) {
      return next(
        new ErrorHandler("Please fill all the fields to process order", 400)
      );
    }
    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      total,
      trackingLink,
      discount,
    });

    // recalculate stock items
    reduceItems(orderItems);
    // invalidate prev cache
    await invalidateCache({ product: true, order: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "The order has been placed successfully!",
    });
  }
);

export const getAllOrdersAdmin = TryCatch(async (req, res, next) => {
  // creating key for admin orders
  const key = `admin-orders`;
  let orders = [];
  // checking for existing cache
  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({});
    nodeCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getAllOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  
  // creating key for unique user orders
  const key = `orders-${user}`;
  let orders = [];
  // checking for existing cache
  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});
