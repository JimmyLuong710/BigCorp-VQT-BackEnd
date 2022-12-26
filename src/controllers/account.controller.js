import ApiError from "../config/error.config";
import models from "../models";
import AuthService from "../services/AuthService";
import DbService from "../services/DbService";
import httpStatus from "http-status"

const getAccounts = async (req, res) => {
    let filter = {};
    if (req.query.key) filter.userName = new RegExp(req.query.key, "i");

    const accounts = await DbService.find(models.AccountModel, {}, {}, {
        select: '-refreshToken, -password',
        populate: 'branch'
    })

    return res.status(200).json(accounts);
};

const getAccount = async (req, res) => {
    let account = await DbService.findOne(
        models.AccountModel,
        {_id: req.params.accountId},
        {},
        {excludeFields: "-password -refreshToken", notAllowNull: true}
    );

    return res.json(account);
};

const updateAccount = async (req, res) => {
    if (req.account._id == req.params.accountId) {
        let account = await DbService.updateOne(
            models.AccountModel,
            {
                _id: req.params.accountId,
            },
            {username: req.body.username},
            {new: true, select: "-password -refreshToken"},
            {notAllowNull: true}
        );

        return res.json(account);
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
    }
};

const deleteAccount = async (req, res) => {
    if (req.account._id == req.params.accountId) {
        let account = await DbService.findOne(
            models.AccountModel,
            {_id: req.params.accountId},
            {},
            {excludeFields: "-password", notAllowNull: true}
        );

        if (account.role == "ADMIN") {
            throw new ApiError(httpStatus.BAD_REQUEST, "Can not delete admin account");
        }

        await account.deleteOne();

        return res.json("Delete successful");
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
    }
};

const addAccount = async (req, res) => {
    let username = await models.AccountModel.findOne({
        username: req.body.username,
    });
    if (username) {
        throw new ApiError(httpStatus.BAD_REQUEST, "username already exists");
    }

    let hash = await AuthService.hashPassword(req.body.password);

    let account = await models.AccountModel.create({
        ...req.body,
        password: hash,
    });
    await models.BranchModel.updateOne({_id: req.body.branch}, {owner: account._id})

    return res.json("Add successful");
};

module.exports = {
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    addAccount,
};
