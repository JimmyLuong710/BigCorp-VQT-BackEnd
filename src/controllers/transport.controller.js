import DbService from "../services/DbService";
import models from "../models";

const requestTransportGoods = async (req, res) => {
  // const branchFrom = await DbService.findOne(models.BranchModel, { _id: req.body.from }, {}, { notAllowNull: true });
  // const branchTo = await DbService.findOne(models.BranchModel, { _id: req.body.to }, {}, { notAllowNull: true });

  // if ((branchTo.owner !== req.account._id && req.body.type === "IMPORT") || (branchFrom.owner !== req.account._id && req.body.type === "EXPORT"))
  //   throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");

  await DbService.create(models.TransportModel, req.body);

  return res.json("Requested successfully");
};

const handleTransportGoods = async (req, res) => {
  if (req.body.status !== "CONFIRMED") return res.json("Cancelled transportation");

  let transport = await DbService.updateOne(
    models.TransportModel,
    { _id: req.params.transportId },
    { status: req.body.status, handledDate: new Date() },
    { new: true },
    { notAllowNull: true }
  );
  const branchFrom = await DbService.findOne(models.BranchModel, { _id: transport.from }, {});
  const branchTo = await DbService.findOne(models.BranchModel, { _id: transport.to }, {}, {});

  await DbService.updateOne(models.StoreModel, { branch: branchFrom._id, isTempStore: false }, { $pull: { products: { $in: transport.products } } });
  await DbService.updateOne(models.StoreModel, { branch: branchTo._id, isTempStore: false }, { $push: { products: transport.products } });

  // determine status and add progress of product when finish import goods
  let productProgress = {
    action: branchFrom.branchType + "_TO_" + branchTo.branchType,
    note: transport.note,
  };
  let productStatus;
  switch (branchTo.type) {
    case "WARRANTY_CENTER":
      productStatus = "FAILED";
      break;
    case "FACTORY":
      productStatus = "FAILED";
      break;
    default:
      productStatus = "IN_STOCK";
  }

  console.log(productProgress, productStatus);
  // update status of product
  for (let productId of transport.products) {
    console.log(productId);
    await DbService.updateOne(models.ProductInstanceModel, { _id: productId }, { status: productStatus, $push: { progress: productProgress } });
  }

  // add to tracking branch
  let trackingBody = {
    products: transport.products,
    note: transport.note,
  };
  await DbService.create(models.BranchTrackingModel, { ...trackingBody, branch: branchFrom._id, type: "EXPORTED"});
  await DbService.create(models.BranchTrackingModel, { ...trackingBody, branch: branchTo._id, type: "IMPORTED" });

  return res.json("Transported goods successfully");
};

const getTransports = async (req, res) => {
 const filter = {
  status: req.query.status ? req.query.status : 'PENDING',
  $or: [
    {
      tye: "IMPORT",
      to: req.account.branch
    },
    {
      tye: "EXPORT",
      from: req.account.branch
    }
  ]
 }
  const reqTransports = await DbService.findAndPaginate(models.TransportModel, filter, {populate: ["from", "to"]}, req)

  return res.json(reqTransports)
}

module.exports = {
  requestTransportGoods,
  handleTransportGoods,
  getTransports
};
