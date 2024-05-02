import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createNewOrder, getAllOrders, getAllOrdersAdmin } from "../controllers/order.js";
const orderRoute = express.Router();
// route : /api/v1/order/create
orderRoute.post("/create", createNewOrder);
// route : /api/v1/orders/admin-orders
orderRoute.get("/admin-orders", adminOnly, getAllOrdersAdmin);
// route : /api/v1/orders/all
orderRoute.get("/all", getAllOrders);
export default orderRoute;
