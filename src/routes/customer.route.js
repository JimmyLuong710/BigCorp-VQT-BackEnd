
import express from 'express';
import { addCustomer, getCustomers } from '../controllers/customer.controller';

const customerRouter = express.Router()

customerRouter.get("/", getCustomers)
customerRouter.post("/", addCustomer)

export default customerRouter
