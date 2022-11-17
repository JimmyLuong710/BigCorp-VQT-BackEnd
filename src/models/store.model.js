import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    amountProducts: Number,
    capacity: Number,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductTracking",
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const StoreModel = mongoose.model("Store", schema);

module.exports = StoreModel;
