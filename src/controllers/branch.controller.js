import models from "../models";
import ApiError from "../config/error.config";
import DbService from "../services/DbService";
import httpStatus from "http-status";

const addBranch = async (req, res) => {
    if(req.account.role !== "ADMIN") throw new ApiError(httpStatus.FORBIDDEN, "Not authorized")

    await DbService.create(models.BranchModel, req.body)
    return res.json("Added branch successfully")
}

const getBranches = async (req, res) => {
    let branches = await DbService.find(models.BranchModel, {branchType: req.query.branchType}, {}, {populate: 'owner'})
    return res.json(branches)
}

const getBranch = async (req, res) => {
    const branch = await DbService.findOne(models.BranchModel, {_id: req.params.branchId})
    return res.json(branch)
}

const addStore = async (req, res) => {
    let isStoreExist = await DbService.findOne(models.StoreModel, {branch: req.params.branchId}) 
    if(isStoreExist) throw new ApiError(httpStatus.BAD_REQUEST, "Store already exists")

    await DbService.create(models.StoreModel, {...req.body, branch: req.params.branchId})
    // await DbService.updateOne(models.BranchModel, {_id: req.params.branchId}, {$push: {stores: store._id}})
    
    return res.json("Added store successfully")
}

module.exports = {
    addBranch, 
    getBranches,
    addStore,
    getBranch
}