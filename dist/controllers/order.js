import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceItems } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility-class.js";
export const createNewOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, total, trackingLink, discount, } = req.body;
    if (!shippingInfo ||
        !orderItems ||
        !user ||
        !subtotal ||
        !tax ||
        !shippingCharges ||
        !total ||
        !trackingLink ||
        !discount) {
        return next(new ErrorHandler("Please fill all the fields to process order", 400));
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
});
