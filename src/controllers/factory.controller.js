import DbService from "../services/DbService";
import models from "../models";
import httpStatus from "http-status";
import ApiError from "../config/error.config";

const produceProduct = async (req, res) => {

    let filter = {
        branch: req.account.branch,
        isTempStore: true,
    };

    let devices = []
    for (let i = 0; i < req.body.quantity; i++) {
        devices.push({
            model: ((Math.random() + 1).toString(36).substring(8)) + '-' + Math.round(((Math.random() + 1) * 1000)),
            product: req.body.product
        })
    }

    devices = (await DbService.insertMany(models.ProductInstanceModel, devices)).map((device, id) => device._id)
    await DbService.updateOne(models.StoreModel, filter, {$push: {products: devices}}, {upsert: true});
    await DbService.create(models.BranchTrackingModel, {
        branch: req.account.branch,
        products: devices,
        type: 'PRODUCED',
        note: req.body.note
    })

    return res.json("Produced product successfully");
};

const getProducts = async (req, res) => {
    let storeFilter = {
        branch: req.account.branch,
        isTempStore: req.query.tempStore ? true : false,
    };

    const store = await models.StoreModel.findOne(storeFilter).select({products: 1}).populate({
        path: 'products',
        select: 'product producedDate model',
        populate: {
            path: 'product',
            select: 'productName',
            model: 'Product'
        }
    })
   console.log(store)
    return res.json(store.products);
};

const transportToStore = async (req, res) => {
    let trackingBody = {
        branch: req.account.branch,
        products: req.body.products,
        type: "IMPORTED",
        note: req.body.note,
    };
    console.log(req.body)
    // update store in factory
    await DbService.updateOne(models.StoreModel, {
        branch: req.account.branch,
        isTempStore: true
    }, {$pull: {products: {$in: req.body.products}}});

    const store = await DbService.updateOne(models.StoreModel, {
        branch: req.account.branch,
        isTempStore: false
    }, {$push: {products: req.body.products}});
    // update status of product instance
    for (const product of req.body.products) {
        await DbService.updateOne(models.ProductInstanceModel, {_id: product}, {
            status: "IN_STOCK",
            store: store._id,
            $push: {progress: {action: "FACTORY_TO_STORE", note: req.body.note, location: req.account.branch}}
        });
    }

    // add to tracking factory model
    await DbService.create(models.BranchTrackingModel, trackingBody);

    return res.json("Imported successfully");
};

module.exports = {
    produceProduct,
    getProducts,
    transportToStore,
};
