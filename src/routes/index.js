import express from "express";
import accountRouter from "./account.route";
import productRouter from "./product.route";
import authRouter from "./auth.route";
import branchRouter from "./branch.route";
import authMiddleware from "../middlewares/auth.middleware";
import transportRouter from "./transport.route";
require("express-async-errors");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/accounts", authMiddleware, accountRouter);
mainRouter.use("/product-lines", productRouter);
mainRouter.use("/branches", branchRouter);
mainRouter.use("/transports", transportRouter);

module.exports = mainRouter;
