import express from "express";
import {
  signUp,
  signIn,
  logOut,
  refreshToken,
  changePassword,
} from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
require("express-async-errors");

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/log-out", authMiddleware, logOut);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/change-password", authMiddleware, changePassword);

module.exports = authRouter;
