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
            product: req.body.product,
            branch: req.account.branch
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
        isTempStore: req.query.tempStore,
    };

    const store = await models.StoreModel.findOne(storeFilter).select({products: 1}).populate({
        path: 'products',
        select: 'product producedDate model status',
        populate: {
            path: 'product',
            select: 'productName',
            model: 'Product'
        }
    })
    let products = store.products
    if(req.query.status) products = products.filter((product) => {
        return product.status == req.query.status
    })

    return res.json(products);
};

const transportToStore = async (req, res) => {
    let trackingBody = {
        branch: req.account.branch,
        products: req.body.products,
        type: "IMPORTED",
        note: req.body.note,
    };
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
            status: "IMPORTED_STORE",
            store: store._id,
            $push: {progress: {action: "IMPORTED_STORE", location: req.account.branch}}
        });
    }

    // add to tracking factory model
    await DbService.create(models.BranchTrackingModel, trackingBody);

    return res.json("Imported successfully");
};

const handleOrder = async (req, res) => {
    let transport = await DbService.updateOne(models.TransportModel, {_id: req.params.transportId},{status: req.body.status},{}, {} )
    await DbService.create(models.BranchTrackingModel, {
        branch: req.branch,
        type: 'IMPORTED',
        partner: transport.from,
        products: transport.products,
        handleType: req.body.status,
        note: transport.note
    })

    return res.json('Handled successfully')
}

const getOrders = async (req, res) => {
    let filter = {
        to: req.account.branch,
        status: 'PENDING'
    }
    const orders = await DbService.find(models.TransportModel, filter, {}, {populate: ['from', 'to', 'products']})
    return res.json(orders)
}

module.exports = {
    produceProduct,
    getProducts,
    transportToStore,
    getOrders,
    handleOrder
};
