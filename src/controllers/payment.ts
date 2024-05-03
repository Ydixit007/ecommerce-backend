import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { ErrorHandler } from "../utils/utility-class.js";

export const createNewCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));

  await Coupon.create({ coupon, amount });
  return res.status(201).json({
    success: true,
    message: "coupon created!",
  });
});

export const applyCoupon = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ coupon });

  if (!discount) return next(new ErrorHandler("Invalid coupon", 400));

  return res.status(200).json({
    success: true,
    discount,
  });
});
