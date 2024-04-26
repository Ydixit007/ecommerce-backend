import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorHandlerMiddleware } from "./middlewares/error.js";

// init
const app = express();
const port = 3000;
app.use(express.json());
connectDB();

// routes 
app.get("/",(req,res)=>{
    res.send("Api working!")
})

app.use("/api/v1/user", userRoute);

// error handeling 
app.use(errorHandlerMiddleware);
app.listen(port, ()=>{
    console.log("app is listening");
})