import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
require("express-async-errors");

const productRouter = express.Router();

productRouter.get("/:productId", getProduct);
productRouter.get("/", getProducts);
productRouter.post("/", authMiddleware, uploadMiddleware, addProduct);
productRouter.put("/:productId", authMiddleware, uploadMiddleware, updateProduct);
productRouter.delete("/:productId", authMiddleware, deleteProduct);

module.exports = productRouter;
