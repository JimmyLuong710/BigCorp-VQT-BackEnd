import {
  getAccounts,
  getAccount,
  addAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/account.controller";
import express from "express";
require("express-async-errors");

const accountRouter = express.Router();

accountRouter.get("/", getAccounts);
accountRouter.get("/:accountId", getAccount);
accountRouter.post("/", addAccount);
accountRouter.put("/:accountId", updateAccount);
accountRouter.delete("/:accountId", deleteAccount);

module.exports = accountRouter;
