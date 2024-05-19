import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema(
// add or update the schema for User
{
    _id: { type: String, required: [true, "Please enter ID."] },
    name: { type: String, required: [true, "Please enter name."] },
    email: {
        type: String,
        unique: [true, "Email already exists."],
        required: [true, "Please enter email."],
        validate: validator.default.isEmail,
    },
    photo: { type: String, required: [true, "Please enter photo."] },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter gender."],
    },
    dob: {
        type: Date,
        required: [true, "Please enter date of birth."],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() == dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
