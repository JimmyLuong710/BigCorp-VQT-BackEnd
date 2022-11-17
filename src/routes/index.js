import express from 'express';
import accountRouter from './account.route'
import productRouter from './product.route'
import authRouter from './auth.route'
import orderRouter from './order.route'
import authMiddleware from '../middlewares/auth.middleware'
require('express-async-errors');

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter)
mainRouter.use('/accounts', authMiddleware, accountRouter)
mainRouter.use('/products', productRouter)
mainRouter.use('/orders', authMiddleware, orderRouter)

module.exports = mainRouter;