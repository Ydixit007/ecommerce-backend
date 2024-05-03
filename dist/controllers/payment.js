import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { ErrorHandler } from "../utils/utility-class.js";
export const createNewCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        next(new ErrorHandler("Please enter both coupon and amount", 400));
    await Coupon.create({ coupon, amount });
    return res.status(201).json({
        success: true,
        message: "coupon created!",
    });
});
