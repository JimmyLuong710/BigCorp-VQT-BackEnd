import express from "express";
import accountRouter from "./account.route";
import productRouter from "./product.route";
import authRouter from "./auth.route";
import branchRouter from "./branch.route";
import authMiddleware from "../middlewares/auth.middleware";
import transportRouter from "./transport.route";
import factoryRouter from "./factory.route";
import distributorRouter from "./distributor.route";
import customerRouter from "./customer.route";
require("express-async-errors");

import models from "../models";
import mongoose from "mongoose";
import adminRouter from "./admin.router";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/accounts", authMiddleware(), accountRouter);
mainRouter.use("/product-lines", productRouter);
mainRouter.use("/branches", authMiddleware(), branchRouter);
mainRouter.use("/transports", authMiddleware(), transportRouter);
mainRouter.use("/factory", authMiddleware(), factoryRouter);
mainRouter.use("/distributor", authMiddleware(['DISTRIBUTOR']), distributorRouter);
mainRouter.use("/customers", authMiddleware(), customerRouter);
mainRouter.use("/admin",authMiddleware(['ADMIN']), adminRouter)

mainRouter.get("/test", async (req, res) => {
  let store = await models.StoreModel.findOne({ _id: "637e663daed32de6803c390b" });
  let data = await models.ProductInstanceModel.aggregate()
    .match({ _id: { $in: store.products } })
    .group({
      _id: "$product",
      count: { $count: {} },
      devices: {
        $addToSet: {
          model: "$model",
        },
      },
    })
    .lookup({ from: "products", localField: "_id", foreignField: "_id", as: "product" })
    .project({
      product: { $arrayElemAt: ["$product", 0] },
      count: 1,
      devices: 1,
      _id: 0,
    });

  res.json(data);
});

module.exports = mainRouter;
