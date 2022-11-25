import express from "express";
import accountRouter from "./account.route";
import productRouter from "./product.route";
import authRouter from "./auth.route";
import branchRouter from "./branch.route";
import authMiddleware from "../middlewares/auth.middleware";
import transportRouter from "./transport.route";
import factoryRouter from "./factory.route";
require("express-async-errors");

import models from "../models";
import mongoose from "mongoose";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/accounts", authMiddleware, accountRouter);
mainRouter.use("/product-lines", productRouter);
mainRouter.use("/branches", authMiddleware, branchRouter);
mainRouter.use("/transports", transportRouter);
mainRouter.use("/factory", authMiddleware, factoryRouter);

mainRouter.get("/test", async (req, res) => {
  let store = await models.StoreModel.findOne({ _id: "637e663daed32de6803c390b" });
  let data = await models.ProductInstanceModel.aggregate()
    .match({ _id: { $in: store.products } })
    .group({ _id: "$product", count: { $count: {} }, "devices": {
      $addToSet: {
        model: "$model"
      }
    } })
    .lookup({ from: "products", localField: "_id", foreignField: "_id", as: "product" })
    .project({
      product: { $arrayElemAt: [ "$product", 0 ] },
      count: 1,
      devices: 1,
      _id: 0
    })  
  // let data = await models.StoreModel.aggregate()
  // .project('-_id products')
  // .lookup({ from: "product-instances", localField: "products", foreignField: "_id", as: "products" })
  // .unwind("products")
  // .lookup({ from: "products", localField: "products.product", foreignField: "_id", as: "products.product" })
  // .group({ _id: "$product.productName", count: { $count: {} } });
  // .match({ _id: mongoose.Types.ObjectId("637e663daed32de6803c390b") })
  //     .lookup({ from: "product-instances", localField: "products", foreignField: "_id", as: "products" })
  // .sortByCount("$products.product")
  // .match({ _id: mongoose.Types.ObjectId("637e663daed32de6803c390b") })
  // .project('-_id products')
  // .lookup({ from: "product-instances", localField: "products", foreignField: "_id", as: "products" })
  // .unwind("products")
  // .lookup({ from: "products", localField: "products.product", foreignField: "_id", as: "product" })
  // .addFields({ "product.name": "$product.productName" })
  // .group({ _id: "$productName", count: { $count: {} } });
  // .lookup({ from: "products", localField: "_id", foreignField: "_id", as: "products" });

  res.json(data);
});

module.exports = mainRouter;
