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
const OrderModel = mongoose.model("Order", schema);

module.exports = OrderModel;
