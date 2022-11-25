import DbService from "../services/DbService";
import models from "../models";

const addCustomer = async (req, res) => {
    await DbService.create(models.CustomerModel, req.body)
    return res.json("Added customer successfully")
}

const getCustomers = async (req, res) => {
    const customers = await DbService.find(models.CustomerModel, {})
    return res.json(customers)
}

module.exports = {
    addCustomer,
    getCustomers
}