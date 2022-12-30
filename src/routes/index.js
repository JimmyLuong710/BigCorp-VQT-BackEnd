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
import mongoose, { model } from "mongoose";
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

mainRouter.get('/get',async (req, res) => {

    let product = await models.ProductInstanceModel.find({}).select('_id').skip(1).limit(200)
    product = product.map(p => p._id)
    res.json(product)
})

mainRouter.put('/pot', async (req, res) => {
    // const store = await models.StoreModel.findOne({branch: '63af0da55cd1756b16342a14'})
    
    // // console.log(store.products)
    // await models.StoreModel.updateOne({_id: store._id}, {
    //     $pull: {
    //         products: {$in: store.products}
    //     }
    // })
   let store = await models.StoreModel.findOne({_id: '63af0e0f5cd1756b16342a2a'})
    for(let product of store.products) {
        await models.ProductInstanceModel.updateOne({_id: product}, {status: 'TAKE_FAILED_TO_WARRANTY_CENTER'})
    }
    
    res.json(store)
})

module.exports = mainRouter;
