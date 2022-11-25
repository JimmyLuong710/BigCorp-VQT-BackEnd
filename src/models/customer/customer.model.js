import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
   fullName: String,
   phone: String,
   products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductInstance'
   }]
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const CustomerModel = mongoose.model("Customer", schema);

module.exports = CustomerModel;
