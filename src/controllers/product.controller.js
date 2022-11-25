import ApiError from "../config/error.config";
import models from "../models";
import DbService from "../services/DbService";

const addProduct = async (req, res) => {
  await DbService.findOne(models.ProductLineModel, { _id: req.params.productLineId }, {}, { notAllowNull: true });
  await DbService.create(models.ProductModel, { ...req.body, productLine: req.params.productLineId });

  return res.json("Added product successfully");
};

const getProducts = async (req, res) => {
  // if (req.query.key) {
  //   filter.productName = new RegExp(req.query.key, "i");
  // }
  let products = await DbService.findAndPaginate(models.ProductModel, { productLine: req.params.productLineId }, {}, req);

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
