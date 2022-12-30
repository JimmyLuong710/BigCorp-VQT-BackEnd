
import express from 'express';
import {addCustomer, getCustomer, getCustomers} from '../controllers/customer.controller';

const customerRouter = express.Router()

customerRouter.get("/", getCustomers)
customerRouter.post("/", addCustomer)
customerRouter.get('/:customerId', getCustomer)
export default customerRouter
