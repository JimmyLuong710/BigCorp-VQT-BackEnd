import ApiError from "../config/error.config";
import models from "../models";
import AuthService from "../services/AuthService";
import DbService from "../services/DbService";

const getAccounts = async (req, res) => {
  if (req.account.role !== "admin") {
    throw new ApiError(403, "Not authorized");
  }

  let filter = {};
  if (req.query.key) filter.userName = new RegExp(req.query.key, "i");

  const accounts = await DbService.findAndPaginate(
    models.AccountModel,
    filter,
    { select: "-password -refreshToken" },
    req
  );

  return res.status(200).json(accounts);
};

const getAccount = async (req, res) => {
  if (req.account.role !== "admin") {
    throw new ApiError(403, "Not authorized");
  }

  let account = await DbService.findOne(
    models.AccountModel,
    { _id: req.params.accountId },
    {},
    { excludeFields: "-password -refreshToken", notAllowNull: true }
  );

  return res.json(account);
};

const updateAccount = async (req, res) => {
  if (req.account.role == "admin" || req.account._id == req.params.accountId) {
    let account = await DbService.updateOne(
      models.AccountModel,
      {
        _id: req.params.accountId,
      },
      { userName: req.body.userName },
      { new: true, select: "-password -refreshToken" },
      { notAllowNull: true }
    );

    return res.status(200).json(account);
  } else {
    throw new ApiError(403, "Not authorized");
  }
};

const deleteAccount = async (req, res) => {
  if (req.account.role == "admin" || req.account._id == req.params.accountId) {
    let account = await DbService.findOne(
      models.AccountModel,
      { _id: req.params.accountId },
      {},
      { excludeFields: "-password", notAllowNull: true }
    );

    if (account.role == "admin") {
      throw new ApiError(400, "Can not delete admin account");
    }

    await account.deleteOne();

    return res.status(200).json(account);
  } else {
    throw new ApiError(403, "Not authorized");
  }
};

const addAccount = async (req, res) => {
  let username = await models.AccountModel.findOne({
    userName: req.body.userName,
  });
  if (username) {
    throw new ApiError(400, "username already exists");
  }

  let email = await models.AccountModel.findOne({
    email: req.body.email,
  });
  if (email) {
    throw new ApiError(400, "email already exists");
  }

  let hash = await AuthService.hashPassword(req.body.password);

  let data = await models.AccountModel.create({
    ...req.body,
    password: hash,
    role: "user",
  });

  data = data.toObject();
  delete data.password;

  return res.status(200).json(data);
};

module.exports = {
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  addAccount,
};
