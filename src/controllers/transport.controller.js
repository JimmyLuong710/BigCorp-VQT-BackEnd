import DbService from "../services/DbService"
import ApiError from "../config/error.config"
import models from "../models"

const getOrders = async (req, res) => {
    let filter = {
        owner: req.account._id
    }
    let dbOptions = {
        populate: ['products.product', 'deliveryInfo']
    }
    
    let orders = await DbService.findAndPaginate(models.OrderModel, filter, dbOptions, req)

    return res.json(orders)
}

const getOrdersPending = async (req, res) => {
    if(req.account.role != 'admin') {
        throw new ApiError(403, 'Not authorize')
    }

    let filter = {
        status: 'PENDING'
    }
    let dbOptions = {
        populate: ['products.product', 'deliveryInfo']
    }
    
    let orders = await DbService.findAndPaginate(models.OrderModel, filter, dbOptions, req)

    return res.json(orders)
}

const handleOrder = async (req, res) => {
    if(req.account.role != 'admin') {
        throw new ApiError(403, 'Not authorized')
    }

    let order = await DbService.updateOne(models.OrderModel, {_id: req.params.orderId}, {status: req.body.status}, {new: true, runValidators: true}, {notAllowNull: true})
    
    // increase quantity of product sold 
    if(req.body?.status === 'CONFIRMED') {
        for(let product of order.products) {
            await DbService.updateOne(models.ProductModel, {_id: product.product}, {$inc: {quantitySold: product.quantityOrdered}})
        }
    }
    
    return res.json(order)
}

const addOrder = async (req, res) => {
    let docBody = {
        ...req.body,
        owner: req.account._id
    }
    let order = await DbService.create(models.OrderModel, docBody)

    return res.json(order)
}

const deleteOrder = async (req, res) => {
    let filter = {
        owner: req.account._id
    }
    let order = await DbService.deleteOne(models.OrderModel, filter, {}, {notAllowNull: true})

    return res.json(order)
}

module.exports = {
    getOrders,
    getOrdersPending,
    addOrder,
    deleteOrder,
    handleOrder
}