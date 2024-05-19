import express from "express";
import { createNewUserController, deleteUser, getAllUsers, getUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const userRoute = express.Router();

// route : /api/v1/user/create
userRoute.post("/create", createNewUserController);

// route : /api/v1/user/all
userRoute.get("/all", adminOnly, getAllUsers);

// route : /api/v1/user/:id (dynamic Id)
userRoute.get("/:id", getUser);

// route: api/vi/user/delete
userRoute.delete("/:id",adminOnly, deleteUser);


export default userRoute;