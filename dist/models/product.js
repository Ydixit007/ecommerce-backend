import mongoose from "mongoose";
const schema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "please enter the product name"],
    },
    productImage: {
        type: String,
        required: [true, "please enter the product image"],
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
    },
    discount: {
        type: Number,
    },
    sizes: {
        type: (Array),
        required: [true, "please enter price"],
    },
    stock: {
        type: (Array),
        required: [true, "please enter stock for each size"],
    },
    category: {
        type: String,
        required: [true, "please enter a category"],
    },
}, { timestamps: true });
export const Product = mongoose.model("Product", schema);
