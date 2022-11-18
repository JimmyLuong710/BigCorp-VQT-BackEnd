import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  { 
    productName: {
      type: String,
      trim: true,
      required: true,
    },
    ram: {
      slots: Number,
      frequency: String,
      amount: Number
    },
    hardDrive: {
      type: String,
      size: String,
      slots: Number
    },
    cpu: String,
    monitor: {
      size: String,
      resolution: String
    },
    weight: String,
    price: Number,
    productLine: String,
    graphic: String,
    origin: String,
    os: String,
    images: [String],
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
