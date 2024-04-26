import express from "express";
import { createNewUserController } from "../controllers/user.js";
const userRoute = express.Router();
userRoute.post("/create", createNewUserController);
export default userRoute;
