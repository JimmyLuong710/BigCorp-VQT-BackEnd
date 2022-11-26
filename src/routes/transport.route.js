import express from "express";
import { requestTransportGoods, handleTransportGoods, getTransports } from "../controllers/transport.controller";
require("express-async-errors");

const transportRouter = express.Router();

transportRouter.post("/", requestTransportGoods);
transportRouter.put("/:transportId", handleTransportGoods);
transportRouter.get("/", getTransports);

module.exports = transportRouter;
