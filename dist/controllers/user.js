import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility-class.js";
export const createNewUserController = TryCatch(async (req, res, next) => {
    const { name, photo, email, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `welcome, ${user.name}`,
        });
    }
    if (!_id || !name || !photo || !email || !gender || !dob) {
        return next(new ErrorHandler("Please add all fields", 400));
    }
    user = await User.create({
        name,
        photo,
        email,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `welcome, ${user.name}`,
    });
});
