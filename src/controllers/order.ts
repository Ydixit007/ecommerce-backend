import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { createOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";

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

    res.send(201).json({
        success: true,
        message: "Your order has been successfully place!",
    })
  }
);
