import models from "../models";
import ApiError from "../config/error.config";
import DbService from "../services/DbService";
import httpStatus from "http-status";

const addBranch = async (req, res) => {
    await DbService.create(models.BranchModel, req.body)
    return res.json("Added branch successfully")
}

const getBranches = async (req, res) => {
    let branches = await DbService.findAndPaginate(models.BranchModel, {}, {}, req)
    return res.json(branches)
}

const getBranch = async (req, res) => {
    
}

const updateBranch = async (req, res) => {
    
}

const deleteBranch = async (req, res) => {
    
}

const addStore = async (req, res) => {
    let store = await DbService.create(models.StoreModel, {...req.body, branch: req.params.branchId})
    await DbService.updateOne(models.BranchModel, {_id: req.params.branchId}, {$push: {stores: store._id}})
    return res.json("Added store successfully")
}

module.exports = {
    addBranch, 
    getBranches,
    getBranch,
    updateBranch,
    deleteBranch,
    addStore
}