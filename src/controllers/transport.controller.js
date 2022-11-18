import DbService from "../services/DbService";
import ApiError from "../config/error.config";
import models from "../models";
import httpStatus from "http-status";

const requestTransportGoods = async (req, res) => {
  const branchFrom = await DbService.findOne(models.BranchModel, { _id: req.body.from }, {}, { notAllowNull: true });
  const branchTo = await DbService.findOne(models.BranchModel, { _id: req.body.to }, {}, { notAllowNull: true });

  if ((branchTo.owner !== req.account._id && req.body.type === "IMPORT") || (branchFrom.owner !== req.account._id && req.body.type === "EXPORT"))
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");

  await DbService.create(models.TransportModel, req.body);

  return res.json("Requested to import goods");
};

const handleTransportGoods = async (req, res) => {
  if (req.status !== "CONFIRM") return res.json("Cancelled transportation");

  let transport = await DbService.findOne(models.TransportModel, { _id: req.params.transportId });
  const branchFrom = await DbService.findOne(models.BranchModel, { _id: transport.from }, {});
  const branchTo = await DbService.findOne(models.BranchModel, { _id: transport.to }, {}, { notAllowNull: true });

  await DbService.updateOne(models.StoreModel, { _id: transport.store }, { $push: { products: transport.products } }, {}, { notAllowNull: true });

  let productProgress = {
    action: branchFrom ? "FACTORY_TO_STORE" : branchFrom.type + "_TO_" + branchTo.type,
    date: new Date(),
    note: transport.note,
  };

  // determine status of product when finish import goods
  let productStatus;
  switch (branchTo.type) {
    case "WARRANTY_CENTER":
      productStatus = "UNDER_WARRANTY";
      break;
    default:
      productStatus = "IN_STOCK";
  }

  // update status of product
  for (let productId of req.body.products) {
    await DbService.updateOne(models.ProductTrackingModel, { _id: productId }, { status: productStatus, progress: productProgress });
  }

  return res.json("Transported goods")
};

const handleExportGoods = async (req, res) => {
  if (req.status !== "CONFIRM") return res.json("Cancelled transportation");

  let transport = await DbService.findOne(models.TransportModel, { _id: req.params.transportId });
  const branchFrom = await DbService.findOne(models.BranchModel, { _id: transport.body.from }, {});
  const branchTo = await DbService.findOne(models.BranchModel, { _id: transport.to }, {}, { notAllowNull: true });

  let productProgress = {
    action: branchFrom.type + "_TO_" + branchTo.type,
    date: new Date(),
    note: transport.note,
  };

  // determine status of product when finish import goods
  let productStatus;
  switch (branchTo.type) {
    case "WARRANTY_CENTER":
      productStatus = "UNDER_WARRANTY";
      break;
    default:
      productStatus = "IN_STOCK";
  }

  // update status of product
  for (let productId of req.body.products) {
    await DbService.updateOne(models.ProductTrackingModel, { _id: productId }, { status: productStatus, progress: productProgress });
  }

  return res.json("Exported goods")
};

module.exports = {
  requestTransportGoods,
  handleTransportGoods
};
