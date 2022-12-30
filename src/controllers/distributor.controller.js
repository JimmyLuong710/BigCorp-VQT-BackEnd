import DbService from "../services/DbService";
import models from "../models";
import httpStatus from "http-status";

const sellProducts = async (req, res) => {

    // make a transaction
    await DbService.updateOne(models.StoreModel, {branch: req.account.branch}, {$pull: {products: {$in: req.body.products}}}, {}, {notAllowNull: true});
    const customerBody = req.body.products?.map(product => ({
        branch: req.account.branch,
        product: product
    }))
    await DbService.updateOne(models.CustomerModel, {_id: req.body.customerId}, {$push: {products: customerBody}}, {}, {notAllowNull: true});

    // add to tracking distributor
    const trackingBody = {
        branch: req.account.branch,
        type: "SOLD",
        customer: req.body.customerId,
        products: req.body.products,
    };
    await DbService.create(models.BranchTrackingModel, trackingBody);

    return res.json("Sold successfully");
};

const summonProducts = async (req, res) => {
};

const handleRequestFromWarranty = async (req, res) => {
    // TODO: add to transport
    const docBody = {

    }
    await DbService.create(docBody)
    return res.json('Requested successfully')
}

module.exports = {
    sellProducts,
    summonProducts,
    handleRequestFromWarranty
};
