import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
   
  },
  {
    timestamps: true,
    collection: 'warranty-centers'
  }
);

schema.plugin(paginate);
const WarrantyCenterModel = mongoose.model("WarrantyCenter", schema);

module.exports = WarrantyCenterModel;
