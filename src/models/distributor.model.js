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
const DistributorModel = mongoose.model("Distributor", schema);

module.exports = DistributorModel;
