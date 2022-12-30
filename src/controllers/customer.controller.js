import DbService from "../services/DbService";
import models from "../models";

const addCustomer = async (req, res) => {
    let customerCode = 'CT' + Math.round(((Math.random() + 1) * 100)) + (new Date()).getTime().toString().substr(-3)
    await DbService.create(models.CustomerModel, {...req.body, code: customerCode})
    return res.json("Added customer successfully")
}

const getCustomers = async (req, res) => {
    let filter = req.query.code ? {code: new RegExp(req.query.code, 'i')} : {}
    const customers = await DbService.find(models.CustomerModel, filter, {}, {})
    return res.json(customers)
}

const getCustomer = async (req, res) => {
    console.log(req.params.customerId)
    const customer = await DbService.findOne(models.CustomerModel, {_id: req.params.customerId}, {}, {
        populate: {
            path: 'products',
            populate: {
                path: 'product',
                select: 'productName'
            }
        }
    })
    console.log(customer)
    return res.json(customer)
}

module.exports = {
    addCustomer,
    getCustomers,
    getCustomer
}