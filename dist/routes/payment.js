import express from "express";
import { applyCoupon, createNewCoupon, deleteCoupon, getAllCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const paymentRoute = express.Router();
// route: /payment/coupon/create
paymentRoute.post("/coupon/create", adminOnly, createNewCoupon);
// route: /payment/coupon/apply
paymentRoute.get("/coupon/apply", applyCoupon);
// route: /payment/coupon/all
paymentRoute.get("/coupon/all", adminOnly, getAllCoupon);
// route: /payment/coupon/:id
paymentRoute.delete("/coupon/:id", adminOnly, deleteCoupon);
export default paymentRoute;
