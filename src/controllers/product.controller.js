import ApiError from "../config/error.config";
import models from "../models";
import DbService from "../services/DbService";

const addProduct = async (req, res) => {
    await DbService.create(models.ProductModel, req.body);

    return res.json("Added product successfully");
};

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

module.exports = {
    addProduct,
    getProducts,
    addProductLine,
    getProductLines,
};
