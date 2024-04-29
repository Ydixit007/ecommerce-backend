import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
export const createNewOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, total, trackingLink, discount, } = req.body;
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
    });
});
