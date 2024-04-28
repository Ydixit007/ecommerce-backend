import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorHandlerMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/product.js";
import NodeCache from "node-cache";
// init
const app = express();
const port = 3000;
app.use(express.json());
connectDB();

// creating a instance of node cache (This will store data in cache memory for better response times).
export const nodeCache = new NodeCache();

// routes
app.get("/", (req, res) => {
  res.send("Api working!");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use("/uploads", express.static("uploads"));
// error handeling
app.use(errorHandlerMiddleware);
app.listen(port, () => {
  console.log("app is listening");
});
