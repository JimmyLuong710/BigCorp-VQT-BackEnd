import DbService from "../services/DbService";
import models from "../models";
import httpStatus from "http-status";
import ApiError from "../config/error.config";

const produceProduct = async (req, res) => {
  if (!req.account?.branch || req.account?.role !== "PRODUCER") throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");

  let filter = {
    branch: req.account.branch,
    isTempStore: true,
  };

  let device = await DbService.create(models.ProductInstanceModel, { product: req.params.productId, ...req.body });
  await DbService.updateOne(models.StoreModel, filter, { $push: { products: device._id } }, { upsert: true });

  return res.json("Produced product successfully");
};

const getProducts = async (req, res) => {
  if (!req.account?.branch || req.account?.role !== "PRODUCER") throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");

  let storeFilter = {
    branch: req.account.branch,
    isTempStore: req.query.tempStore ? true : false,
  };
  let store = await DbService.findOne(models.StoreModel, storeFilter, {}, { notAllowNull: true });

  // find all device in store and group them by product id
  let devices = await models.ProductInstanceModel.aggregate()
    .match({ _id: { $in: store.products } })
    .group({
      _id: "$product",
      count: { $count: {} },
      devices: {
        $addToSet: {
          model: "$model",
        },
      },
    })
    .lookup({ from: "products", localField: "_id", foreignField: "_id", as: "product" })
    .project({
      product: { $arrayElemAt: ["$product", 0] },
      count: 1,
      devices: 1,
      _id: 0,
    });

  return res.json(devices);
};

const transportToStore = async (req, res) => {
  let trackingBody = {
    branch: req.account.branch,
    type: "IMPORTED",
    ...req.body,
  };

  // update store in factory
  await DbService.updateOne(models.StoreModel, { branch: req.account.branch, isTempStore: true }, { $pull: { products: { $in: req.body.products } } });

  // update status of product instance
  for (const product of req.body.products) {
    await DbService.updateOne(models.StoreModel, { branch: req.account.branch, isTempStore: false }, { $push: { products: product } });
    await DbService.updateOne(models.ProductInstanceModel, { _id: product }, { status: "IN_STOCK", $push: { progress: { action: "FACTORY_TO_STORE", note: req.body.note } } });
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
