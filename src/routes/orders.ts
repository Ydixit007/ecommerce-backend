import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createNewOrder } from "../controllers/order.js";

const orderRoute = express.Router();

// route : /api/v1/order/create
orderRoute.post("/create", createNewOrder);

export default orderRoute;
