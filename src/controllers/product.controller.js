import models from "../models";
import DbService from "../services/DbService";

const addProduct = async (req, res) => {
    await DbService.create(models.ProductModel, req.body);
    return res.json("Added product successfully");
};

const getProduct = async (req, res) => {
    let product = await DbService.findOne(models.ProductModel, {_id: req.params.productId}, {}, {})
    return res.json(product)
}
const getProducts = async (req, res) => {
    let products = await DbService.find(models.ProductModel, {}, {}, {
        populate: 'productLine',
        sort: {productLine: 1}
    })

    return res.json(products);
};

const addProductLine = async (req, res) => {
    await DbService.create(models.ProductLineModel, req.body);
    return res.json("Added product line successfully");
};

const getProductLines = async (req, res) => {
    let productLines = await DbService.findAndPaginate(models.ProductLineModel, {}, {}, req);
    return res.json(productLines);
};

const getProductInstances = async (req, res) => {
    let filter = req.query.model ? {model: new RegExp(req.query.model, "i")} : {}
    if (req.query.status) filter.status = req.query.status
    let instances = await DbService.find(models.ProductInstanceModel, filter, {}, {
        excludeFields: '-progress',
        lean: true,
        populate: [{
            path: 'product',
            select: 'productName price'
        }, {
            path: 'branch',
            select: 'branchName branchType'
        }]
    })

    if (req.query.branchType) {
        instances = instances.filter((instance) => instance.branch.branchType === req.query.branchType)
    }
    if (req.query.productName) {
        instances = instances.filter((instance) => instance.product.productName.includes(req.query.productName))
    }

    return res.json(instances)
}

const getInstancesByBranchId = async (req, res) => {
    const filter = {
        branch: req.params.branchId,
        isTempStore: false
    }
    let statuses = req.query.status ? (Array.isArray(req.query.status) ? req.query.status : [req.query.status]) : []
    const store = await models.StoreModel.findOne(filter).select({products: 1}).populate({
        path: 'products',
        select: 'product producedDate model status createdAt updatedAt',
        populate: {
            path: 'product',
            select: 'productName price',
            model: 'Product'
        }
    }).lean()

    let products = store.products
    if(req.query.model) {
        products = products.filter(product => product.model.includes(req.query.model))
    }
    if (statuses.length > 0) {
        products = products.filter(product => {
            for (let status of statuses) {
                if (product.status == status) return true
            }
            return false
        })
    }

    return res.json(products);
}

const getProductInstance = async (req, res) => {
    let instance = await DbService.findOne(models.ProductInstanceModel, {_id: req.params.instanceId}, {}, {
        populate: [
            {
                path: 'progress.location',
                select: 'branchName'
            },
            {
                path: 'progress.customer'
            }
        ]
    })
    return res.json(instance)
}

module.exports = {
    addProduct,
    getProducts,
    getProduct,
    getProductInstances,
    getInstancesByBranchId,
    getProductInstance,
    addProductLine,
    getProductLines,
};
