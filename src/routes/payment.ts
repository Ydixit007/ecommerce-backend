import express from "express";
import { createNewCoupon } from "../controllers/payment.js";

const paymentRoute = express.Router();

paymentRoute.post("/coupon/create", createNewCoupon);

export default paymentRoute