import DbService from "../services/DbService";
import models from "../models";
import httpStatus from "http-status";

const sellProducts = async (req, res) => {
  // make a transaction
  await DbService.updateOne(models.StoreModel, { branch: req.account.branch }, { $pull: { products: { $in: req.body.products } } }, {}, { notAllowNull: true });
  await DbService.updateOne(models.CustomerModel, { _id: req.body.customerId }, { $push: { products: req.body.products } }, {}, { notAllowNull: true });

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

const summonProducts = async (req, res) => {};

module.exports = {
  sellProducts,
  summonProducts,
};
