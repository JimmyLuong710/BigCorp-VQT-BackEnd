import express from "express";
import {getProducts} from "../controllers/admin.controller";

const adminRouter = express.Router()

adminRouter.get('/products', getProducts)

export default  adminRouter