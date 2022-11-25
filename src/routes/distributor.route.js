
import express from 'express';
import { produceProduct, getProducts, transportToStore } from '../controllers/distributor.controller';

const distributorRouter = express.Router()

distributorRouter.get("/products/instances", getProducts)
distributorRouter.post("/products/:productId/instances", produceProduct)
distributorRouter.post("/products/transport-to-store", transportToStore)

export default distributorRouter
