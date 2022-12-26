import AuthService from "../services/AuthService";
import models from "../models";
import ApiError from "../config/error.config";

const authMiddleware = (needRoles = []) => async (req, res, next) => {
    try {
        let accessToken = req.headers.authorization.split(" ")[1];
        let decoded = await AuthService.verifyToken(accessToken, "accessToken");
        let account = await models.AccountModel.findOne({
            _id: decoded._id,
        });
        if (!account || (needRoles.length > 0 && !needRoles.includes(account.role))) {
            throw new ApiError(403, "Not authorized");
        }

        req.account = account;
        next();
    } catch (error) {
        console.log(error)
        return error.statusCode === 403 ? res.status(403).json('Not authorized') : res.status(401).json("Not authenticated");
    }
};

export default authMiddleware;
