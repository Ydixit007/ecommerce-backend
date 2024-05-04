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

export const getAllCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new ErrorHandler("no coupons found", 400));

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const {id} = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler("no coupons found", 400));

  await coupon.deleteOne();

  return res.status(200).json({
    success: true,
    message: "coupon successfully deleted!"
  });
});

