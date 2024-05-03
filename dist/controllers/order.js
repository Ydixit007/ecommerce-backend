import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceItems } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { nodeCache } from "../app.js";
// create orders
export const createNewOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, total, trackingLink, discount, } = req.body;
    if (!shippingInfo ||
        !orderItems ||
        !user ||
        !subtotal ||
        !tax ||
        !shippingCharges ||
        !total ||
        !trackingLink) {
        return next(new ErrorHandler("Please fill all the fields to process order", 400));
    }
    const order = await Order.create({
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
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((i) => String(i.productId))
    });
    return res.status(201).json({
        success: true,
        message: "The order has been placed successfully!",
    });
});
// process orders
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    switch (order.status) {
        case "Received":
            order.status = "Processing";
            break;
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "In-transit";
            break;
        case "In-transit":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    // invalidate prev cache
    await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: order.id,
    });
    return res.status(200).json({
        success: true,
        message: "Order status updated",
    });
});
// delete order
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    await order.deleteOne();
    // invalidate prev cache
    await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: order.id,
    });
    return res.status(200).json({
        success: true,
        message: "Order delete",
    });
});
// create all orders in admin
export const getAllOrdersAdmin = TryCatch(async (req, res, next) => {
    // creating key for admin orders
    const key = `admin-orders`;
    let orders = [];
    // checking for existing cache
    if (nodeCache.has(key))
        orders = JSON.parse(nodeCache.get(key));
    else {
        orders = await Order.find().populate("user", ["name", "email", "photo"]);
        nodeCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
// get all orders in user
export const getAllOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    // creating key for unique user orders
    const key = `orders-${user}`;
    let orders = [];
    // checking for existing cache
    if (nodeCache.has(key))
        orders = JSON.parse(nodeCache.get(key));
    else {
        orders = await Order.find({ user });
        nodeCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
// get single order by orderId
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    // creating key for unique user orders
    const key = `singleOrder-${id}`;
    let order;
    // checking for existing cache
    if (nodeCache.has(key))
        order = JSON.parse(nodeCache.get(key));
    else {
        order = await Order.findById(id).populate("user", [
            "name",
            "email",
            "photo",
        ]);
        if (!order)
            return next(new ErrorHandler("Order not found", 404));
        nodeCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
});
