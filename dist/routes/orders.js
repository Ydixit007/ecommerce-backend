import express from "express";
import { createNewOrder } from "../controllers/order.js";
const orderRoute = express.Router();
// route : /api/v1/order/create
orderRoute.post("/create", createNewOrder);
export default orderRoute;
