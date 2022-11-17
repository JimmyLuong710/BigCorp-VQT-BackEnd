import ApiError from "../config/error.config";
import models from "../models";
import DbService from "../services/DbService";

const addProduct = async (req, res) => {
  if (req.account.role !== "admin") {
    throw new ApiError(403, "Not authorized");
  }

  let product = await DbService.create(models.ProductModel, req.body);

  return res.json(product);
};

const getProducts = async (req, res) => {
  let filter = {
    isDeleted: false,
  };
  if (req.query.key) {
    filter.productName = new RegExp(req.query.key, "i");
  }
  if(req.query.type) {
    filter.type = req.query.type;
  }

  let products = await DbService.findAndPaginate(
    models.ProductModel,
    filter,
    {},
    req
  );

  return res.json(products);
};

const getProduct = async (req, res) => {
  let filter = {
    _id: req.params.productId,
    isDeleted: false,
  };
  let product = await DbService.findOne(
    models.ProductModel,
    filter,
    {},
    { notAllowNull: true }
  );

  return res.json(product);
};

const updateProduct = async (req, res) => {
  if (req.account.role != "admin") {
    throw new ApiError(403, "Not authorized");
  }
  let filter = {
    _id: req.params.productId,
    isDeleted: false,
  };

  let product = await DbService.updateOne(
    models.ProductModel,
    filter,
    req.body,
    { new: true },
    { notAllowNull: true }
  );

  return res.json(product);
};

const deleteProduct = async (req, res) => {
  if (req.account.role != "admin") {
    throw new ApiError(403, "Not authorized");
  }

  let filter = {
    _id: req.params.productId,
    isDeleted: false,
  };

  let product = await DbService.findOne(
    models.ProductModel,
    filter,
    {},
    { notAllowNull: true }
  );

  product.isDeleted = true;
  await product.save();

  return res.json(product);
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
