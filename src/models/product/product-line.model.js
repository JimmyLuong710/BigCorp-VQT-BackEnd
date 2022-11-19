import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  { 
   brand: {
    type: String,
    unique: true
   },
   country: String
  },
  {
    timestamps: true,
    collection: "product-lines"
  }
);

schema.plugin(paginate);
const ProductLineModel = mongoose.model("ProductLine", schema);

module.exports = ProductLineModel;
