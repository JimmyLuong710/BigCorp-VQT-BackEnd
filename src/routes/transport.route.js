import express from "express";
import {
    requestTransportGoods,
    handleTransportGoods,
    getTransports,
    getTransportsToHandle
} from "../controllers/transport.controller";
require("express-async-errors");

const transportRouter = express.Router();

transportRouter.post("/", requestTransportGoods);
transportRouter.put("/:transportId", handleTransportGoods);
transportRouter.get("/", getTransports);
transportRouter.get('/need-approve', getTransportsToHandle)

module.exports = transportRouter;
