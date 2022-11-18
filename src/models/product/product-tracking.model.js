import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    model: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    status: {
      type: String,
      enum: ["RECYCLED", "UNDER_WARRANTY", "IS_USING", "IN_STOCK"]
    },
    progress: [
      {
        action: {
          enum: [
            "FACTORY_TO_STORE",
            "FACTORY_TO_DISTRIBUTOR",
            "WARRANTY_CENTER_TO_FACTORY",
            "DISTRIBUTOR_TO_WARRANTY_CENTER",
            "WARRANTY_CENTER_TO_DISTRIBUTOR",
            "SOLD",
            "RECYCLED",
            "GIVE_BACK_CUSTOMER",
            "UNDER_WARRANTY",
            "SUMMON",
            "GIVE_NEW"
          ],
        },
        date: Date,
        note: String,
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    dueDate: Date,
  },
  {
    timestamps: true,
    collection: "product-trackings",
  }
);

schema.plugin(paginate);
const ProductTrackingModel = mongoose.model("ProductTracking", schema);

module.exports = ProductTrackingModel;
