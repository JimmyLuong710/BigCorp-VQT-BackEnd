
import express from 'express';
import {produceProduct, getProducts, transportToStore, handleOrder, getOrders} from '../controllers/factory.controller';

const factoryRouter = express.Router()

factoryRouter.get("/products/instances", getProducts)
factoryRouter.post("/products/instances", produceProduct)
factoryRouter.post("/products/transport-to-store", transportToStore)
factoryRouter.get('/orders', getOrders)
factoryRouter.post('/orders/handle', handleOrder)

export default factoryRouter