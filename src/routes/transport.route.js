import express from "express";
import {requestTransportGoods, handleTransportGoods} from '../controllers/transport.controller'
require("express-async-errors");

const transportRouter = express.Router();

transportRouter.post('/', requestTransportGoods);
transportRouter.put('/', handleTransportGoods)


module.exports = transportRouter;
