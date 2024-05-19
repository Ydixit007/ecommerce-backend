import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorHandlerMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/product.js";
import NodeCache from "node-cache";
import orderRoute from "./routes/orders.js";
import { config } from "dotenv";
import morgan from "morgan";
import paymentRoute from "./routes/payment.js";
import cors from "cors";
// config for env
config({
    path: "./.env"
});
// init
const app = express();
const port = process.env.PORT || 3000;
const mongoDbURI = process.env.MONGODB_URI || "";
app.use(express.json());
// logs the information about requests happening to console for logs.
app.use(morgan("dev"));
app.use(cors());
connectDB(mongoDbURI);
// creating a instance of node cache (This will store data in cache memory for better response times).
export const nodeCache = new NodeCache();
// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("Api working!");
});
// error handeling
app.use(errorHandlerMiddleware);
app.listen(port, () => {
    console.log("app is listening");
});
