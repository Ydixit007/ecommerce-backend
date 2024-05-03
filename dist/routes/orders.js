import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createNewOrder, deleteOrder, getAllOrders, getAllOrdersAdmin, getSingleOrder, processOrder } from "../controllers/order.js";
const orderRoute = express.Router();
// route : /api/v1/order/create
orderRoute.post("/create", createNewOrder);
// route : /api/v1/orders/admin-orders
orderRoute.get("/admin-orders", adminOnly, getAllOrdersAdmin);
// route : /api/v1/orders/all
orderRoute.get("/all", getAllOrders);
// route : /api/v1/orders/:id
orderRoute.get("/:id", getSingleOrder);
// route : /api/v1/orders/:id
orderRoute.put("/:id", adminOnly, processOrder);
// route : /api/v1/orders/:id
orderRoute.delete("/:id", adminOnly, deleteOrder);
export default orderRoute;
