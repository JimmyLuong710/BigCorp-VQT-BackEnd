import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: Number,
    type: {
      type: String,
    },
    status: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    description: String,
    image: String,
    quantitySold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const ProductModel = mongoose.model("Product", schema);

module.exports = ProductModel;
