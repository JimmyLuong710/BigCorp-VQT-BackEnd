import express from "express";
import { sellProducts, summonProducts } from "../controllers/distributor.controller";

const distributorRouter = express.Router();

distributorRouter.post("/products/sell", sellProducts);
distributorRouter.post("/products/summon", summonProducts);

export default distributorRouter;
