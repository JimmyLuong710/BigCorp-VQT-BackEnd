
import express from 'express';
import { produceProduct, getProducts, transportToStore } from '../controllers/factory.controller';

const factoryRouter = express.Router()

factoryRouter.get("/products/instances", getProducts)
factoryRouter.post("/products/instances", produceProduct)
factoryRouter.post("/products/transport-to-store", transportToStore)

export default factoryRouter