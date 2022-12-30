import DbService from "../services/DbService";
import models from "../models"


const switchToWarranty = async (req, res) => {
   await models.ProductInstanceModel.updateMany({_id: {$in: req.body.products}}, {status: req.body.status})
    return res.json('Action successfully')
}

const transportProductsFailedToFactory = async (req, res) => {

}

const giveBackProductsToDistributor = async (req, res) => {
    
}

module.exports = {
    switchToWarranty
}