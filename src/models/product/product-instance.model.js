import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    model: {
      type: String,
      unique: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    status: {
      type: String,
      enum: ["FAILED", "UNDER_WARRANTY", "FIXED_ERROR", "IS_USING", "IN_STOCK", "IDLE"],
      default: "IDLE"
    },
    progress: [
      {
        action: {
          enum: [
            "FACTORY_TO_STORE",
            "FACTORY_TO_DISTRIBUTOR",
            "WARRANTY_CENTER_TO_FACTORY",
            "DISTRIBUTOR_TO_WARRANTY_CENTER",
            "UNDER_WARRANTY",
            "FIXED_ERROR",
            "WARRANTY_CENTER_TO_DISTRIBUTOR",
            "SOLD",
            "GIVE_BACK_CUSTOMER",
            "SUMMON",
            "GIVE_NEW"
          ],
          type: String
        },
        date: {
          type: Date,
          default: new Date()
        },
        note: String,
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    producedDate: {
      type: Date,
      default: new Date()
    },
    dueDate: Date,
  },
  {
    timestamps: true,
    collection: "product-instances",
  }
);

schema.plugin(paginate);
const ProductInstanceModel = mongoose.model("ProductInstance", schema);

module.exports = ProductInstanceModel;
