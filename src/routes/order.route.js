import express from "express";
import {
  getOrders,
  addOrder,
  deleteOrder,
  getOrdersPending,
  handleOrder,
} from "../controllers/order.controller";
require("express-async-errors");

const orderRouter = express.Router();

orderRouter.get("/", getOrders);
orderRouter.get("/pending", getOrdersPending);
orderRouter.put("/:orderId", handleOrder);
orderRouter.post("/", addOrder);
orderRouter.delete("/", deleteOrder);

module.exports = orderRouter;
