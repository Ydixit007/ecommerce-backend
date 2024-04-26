import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
export const createNewUserController = TryCatch(async (req, res, next) => {
    const { name, photo, email, gender, _id, dob } = req.body;
    const user = await User.create({
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
