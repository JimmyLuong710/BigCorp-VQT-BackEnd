import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
   
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const FactoryModel = mongoose.model("Factory", schema);

module.exports = FactoryModel;
