import ApiError from "../config/error.config";
import models from "../models";
import AuthService from "../services/AuthService";
import DbService from "../services/DbService"

const signUp = async (req, res) => {
  let username = await models.AccountModel.findOne({
    userName: req.body.userName,
  });
  if (username) {
    throw new ApiError(400, "Username already exists");
  }

  let email = await models.AccountModel.findOne({
    email: req.body.email,
  });
  if (email) {
    throw new ApiError(400, "Email already exits");
  }

  let hash = await AuthService.hashPassword(req.body.password);
  let account = await models.AccountModel.create({
    ...req.body,
    password: hash,
  });

  account = account.toObject();
  delete account.password;

  return res.status(200).json(account);
};

const signIn = async (req, res) => {
  let account = await models.AccountModel.findOne({
    $or: [{ userName: req.body.userName }, { email: req.body.userName }],
  });
  if (!account) {
    throw new ApiError(400, "wrong username or password");
  }

  let validatedPassword = await AuthService.comparePassword(
    req.body.password,
    account.password
  );
  if (!validatedPassword) {
    throw new ApiError(400, "wrong username or password");
  }

  let accessToken = await AuthService.createToken(
    { _id: account._id },
    "accessToken"
  );
  let refreshToken = await AuthService.createToken(
    { _id: account._id },
    "refreshToken"
  );

  account.refreshToken = refreshToken;
  await account.save();
  account = account.toObject();
  delete account.password;

  return res.status(200).json({
    ...account,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

const logOut = async (req, res) => {
  let account = await models.AccountModel.findOneAndUpdate(
    {
      _id: req.account._id,
    },
    {
      refreshToken: null,
    },
    {
      new: true,
    }
  );

  account = account.toObject();
  delete account.password;

  return res.status(200).json(account);
};

const refreshToken = async (req, res) => {
  let refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    throw new ApiError(403, "Not authenticated");
  }

  let refreshTokenInDb = await models.AccountModel.findOne({
    refreshToken: refreshToken,
  });
  if (!refreshTokenInDb) {
    throw new ApiError(403, "Not authenticated");
  }

  let decoded = await AuthService.verifyToken(refreshToken, "refreshToken");
  let newAccessToken = await AuthService.createToken(
    { _id: decoded._id },
    "accessToken"
  );

  return res.status(200).json({
    accessToken: newAccessToken,
  });
};

const changePassword = async (req, res) => {
  let account = await DbService.findOne(models.AccountModel,{ _id: req.account._id }, {}, {notAllowNull: true});
  let validatedPassword = await AuthService.comparePassword(
    req.body.password,
    account.password
  );
  if (!validatedPassword) {
    throw new ApiError(400, "wrong password");
  }

  let hash = await AuthService.hashPassword(req.body.newPassword);
  account.password = hash;
  account.save();

  return res.json("Update successful");
};

module.exports = {
  signUp,
  signIn,
  logOut,
  refreshToken,
  changePassword
};
