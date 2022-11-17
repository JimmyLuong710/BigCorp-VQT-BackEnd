import ApiError from "../config/error.config"

const errorHandler = (err, req, res, next) => {
    console.log(err)
    if(err instanceof ApiError) {
        return res.status(err.statusCode).json(err.message)
    }

    return res.status(500).json('ERROR INTERNAL SERVER')
}

module.exports = errorHandler