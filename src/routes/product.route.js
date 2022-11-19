import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import express from "express";
import {
  getProducts,
  addProduct,
  addProductLine,
  getProductLines,
  addProductInstance,
  getProductInstances
} from "../controllers/product.controller";
require("express-async-errors");

const productRouter = express.Router();

// product
productRouter.get("/:productLineId/products", getProducts);
productRouter.post("/:productLineId/products", uploadMiddleware, addProduct);

//product line
productRouter.post('/', addProductLine)
productRouter.get('/', getProductLines)

//product instance
productRouter.post('/products/:productId/instances', addProductInstance)
productRouter.get('/products/:productId/instances', getProductInstances)

module.exports = productRouter;
