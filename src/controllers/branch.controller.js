import models from "../models";
import ApiError from "../config/error.config";
import DbService from "../services/DbService";
import httpStatus from "http-status";

const addBranch = async (req, res) => {
    let branch = await DbService.create(models.BranchModel, req.body)
    await DbService.create(models.StoreModel, {branch: branch._id})
    return res.json("Added branch successfully")
}

const getBranches = async (req, res) => {
    let filter = req.query
    if (req.query.owner === 'null') filter.owner = null
    let branches = await DbService.find(models.BranchModel, filter, {}, {populate: 'owner'})
    return res.json(branches)
}

const getBranch = async (req, res) => {
    const branch = await DbService.findOne(models.BranchModel, {_id: req.params.branchId})
    return res.json(branch)
}

const addStore = async (req, res) => {
    let isStoreExist = await DbService.findOne(models.StoreModel, {branch: req.params.branchId})
    if (isStoreExist) throw new ApiError(httpStatus.BAD_REQUEST, "Store already exists")

    await DbService.create(models.StoreModel, {branch: req.params.branchId})
    // await DbService.updateOne(models.BranchModel, {_id: req.params.branchId}, {$push: {stores: store._id}})

    return res.json("Added store successfully")
}

module.exports = {
    addBranch,
    getBranches,
    addStore,
    getBranch
}