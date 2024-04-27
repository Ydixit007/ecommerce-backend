import express from "express";
import { createNewUserController, getAllUsers, getUser } from "../controllers/user.js";
const userRoute = express.Router();
// route : /api/v1/user/create
userRoute.post("/create", createNewUserController);
// route : /api/v1/user/all
userRoute.get("/all", getAllUsers);
// route : /api/v1/user/:id (dynamic Id)
userRoute.get("/:id", getUser);
export default userRoute;
