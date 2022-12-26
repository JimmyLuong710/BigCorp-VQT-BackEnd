import DbService from "../services/DbService";
import models from "../models";
import httpStatus from "http-status";
import ApiError from "../config/error.config";
const getProducts = async (req, res) => {

    let products = await models.ProductModel.aggregate()
        .group({
            _id: "$productLine",
            count: { $count: {} },
            products: {
                $addToSet: {
                    productId: "$_id",
                    productName: "$productName",
                },
            },
        })
        .lookup({ from: "product-lines", localField: "_id", foreignField: "_id", as: "productLine" })
        .project({
            productLine: { $arrayElemAt: ["$productLine", 0] },
            count: 1,
            products: 1,
            _id: 0,
        });

    res.json(products)
}

module.exports = {
    getProducts
}
