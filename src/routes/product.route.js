import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import express from "express";
import {
    getProducts,
    addProduct,
    addProductLine,
    getProductLines,
    getProduct,
    getProductInstances,
    getProductInstance, getInstancesByBranchId
} from "../controllers/product.controller";

require("express-async-errors");

const productRouter = express.Router();

// product
productRouter.get("/products", getProducts);
productRouter.post("/products", uploadMiddleware, addProduct);
productRouter.get('/products/:productId', getProduct)

//product line
productRouter.post('/', addProductLine)
productRouter.get('/', getProductLines)

// product instance
productRouter.get('/products/product/instances', getProductInstances)
productRouter.get('/products/product/instances/:instanceId', getProductInstance)
productRouter.get('/products/instances/branch/:branchId', getInstancesByBranchId)

module.exports = productRouter;
