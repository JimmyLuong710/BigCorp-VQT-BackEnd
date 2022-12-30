import express from "express";
import {
    handleRequestFromWarranty,
    sellProducts,
    summonProducts
} from "../controllers/distributor.controller";

const distributorRouter = express.Router();

distributorRouter.post("/products/sell", sellProducts);
distributorRouter.post('/products/request-import', handleRequestFromWarranty)
distributorRouter.post("/products/summon", summonProducts);

export default distributorRouter;
