import express from "express";
import {switchToWarranty}from "../controllers/warranty-center.controller";

require("express-async-errors");

const warrantyCenterRouter = express.Router();

warrantyCenterRouter.post('/switch-to-warranty', switchToWarranty)

module.exports = warrantyCenterRouter