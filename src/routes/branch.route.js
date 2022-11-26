import express from "express";
import { addBranch, getBranches, addStore } from "../controllers/branch.controller";

import authMiddleware from "../middlewares/auth.middleware";
require("express-async-errors");

const branchRouter = express.Router();

branchRouter.post("/", addBranch);
branchRouter.get("/", getBranches);
branchRouter.post("/:branchId/stores", addStore);

module.exports = branchRouter;
