import express from "express";
import { applyCoupon, createNewCoupon } from "../controllers/payment.js";

const paymentRoute = express.Router();

// route: /payment/coupon/create
paymentRoute.post("/coupon/create", createNewCoupon);

// route: /payment/coupon/apply
paymentRoute.get("/coupon/apply", applyCoupon);


export default paymentRoute