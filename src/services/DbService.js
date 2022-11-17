import mongoose from "mongoose";
import ApiError from "../config/error.config";
import paginateDocsConfig from '../config/paginateDocs.config'

class DbService {
  static async connect() {
    try {
      mongoose.connect(process.env.MONGODB_BASE_URL);
      console.log("Connect to MongoDB successfully");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  static async create(model, body) {
    let data = await model.create(body)
    
    return data
  }

  static async findOne(model, filter, dbOptions = {}, extraOptions = {}) {
    let data = await model.findOne(filter, dbOptions).select(extraOptions.excludeFields).populate(extraOptions?.populate)
    
    if(extraOptions.notAllowNull && !data) {
      throw new ApiError(400, 'The resources does not exist')
    }

    return data
  }

  static async find(model, filter, dbOptions, extraOptions = {}) {
    let data = await model.find(filter, dbOptions).select(extraOptions.excludeFields)

    if(extraOptions.notAllowNull && !data) {
      throw new ApiError(400, 'The resources does not exist')
    }

    return data
  }

  static async updateOne(model, filter, body,  dbOptions = {}, extraOptions = {}) {
    let data = await model.findOneAndUpdate(filter, body, dbOptions)
    
    if(extraOptions.notAllowNull && !data) {
      throw new ApiError(400, 'The resources does not exist')
    }

    return data
  }

  static async deleteOne(model, filter, dbOptions = {}, extraOptions = {}) {
    let data = await model.deleteOne(filter, dbOptions)

    if(extraOptions.notAllowNull && !data) {
      throw new ApiError(400, 'The resources does not exist')
    }

    return data
  }

  static async findAndPaginate(model, filter, dbOptions, req) {
    let paginateOptions = {
      ...paginateDocsConfig.extractQueryFromRequest(req), 
      ...dbOptions}
      
    let data = await model.paginate(filter, paginateOptions);
    data = paginateDocsConfig.getResultPaginate(data)

    return data
  }
}

module.exports = DbService;
