import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  { 
    productName: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    ram: String,
    hardDrive: String,
    cpu: String,
    monitor: String,
    weight: String,
    price: Number,
    graphic: String,
    os: String,
    images: [String],
    productLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductLine" 
    },
    quantitySold: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const ProductModel = mongoose.model("Product", schema);

module.exports = ProductModel;
