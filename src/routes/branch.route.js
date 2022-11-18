import express from "express";
import { addBranch, getBranches, getBranch, updateBranch, deleteBranch, addStore } from "../controllers/branch.controller";

import authMiddleware from "../middlewares/auth.middleware";
require("express-async-errors");

const branchRouter = express.Router();

branchRouter.post('/', addBranch)
branchRouter.get('/', getBranches)
branchRouter.get('/:branchId', getBranch)
branchRouter.put('/:branchId', updateBranch)
branchRouter.delete('/:branchId', deleteBranch)
branchRouter.post('/:branchId/stores', addStore)

module.exports = branchRouter;
