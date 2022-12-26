import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import express from "express";
import {
  getProducts,
  addProduct,
  addProductLine,
  getProductLines
} from "../controllers/product.controller";
require("express-async-errors");

const productRouter = express.Router();

// product
productRouter.get("/products", getProducts);
productRouter.post("/products", uploadMiddleware, addProduct);

//product line
productRouter.post('/', addProductLine)
productRouter.get('/', getProductLines)

module.exports = productRouter;
