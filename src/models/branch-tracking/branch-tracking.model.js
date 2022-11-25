import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    type: {
      type: String,
      enum: ["IMPORTED", "EXPORTED", "SOLD", "FIXED"],
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    targetStore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductInstance",
      },
    ],
    note: String,
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const BranchTrackingModel = mongoose.model("BranchTracking", schema);

module.exports = BranchTrackingModel;
