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
import warrantyCenterRouter from './warranty-center.route'
require("express-async-errors");

import models from "../models";
import mongoose from "mongoose";
import adminRouter from "./admin.router";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/accounts", authMiddleware(), accountRouter);
mainRouter.use("/product-lines", authMiddleware(), productRouter);
mainRouter.use("/branches", authMiddleware(), branchRouter);
mainRouter.use("/transports", authMiddleware(), transportRouter);
mainRouter.use("/factory", authMiddleware(['PRODUCER', 'ADMIN']), factoryRouter);
mainRouter.use("/distributor", authMiddleware(['DISTRIBUTOR', 'ADMIN']), distributorRouter);
mainRouter.use("/customers", authMiddleware(), customerRouter);
mainRouter.use("/admin",authMiddleware(['ADMIN']), adminRouter)
mainRouter.use('/warranty', authMiddleware(['WARRANTY', 'ADMIN']), warrantyCenterRouter)

mainRouter.put('/update',async (req, res) => {

    let instances = await models.ProductInstanceModel.find({}).lean()
    instances = instances.map(ind => ind._id)
    let store = await models.StoreModel.updateOne({branch: '6377cba8cedbc471c7936878'}, {
        $push: {
            products: instances
        }
    })
    // console.log(instances, store)

    res.json('hehe')
})

module.exports = mainRouter;
