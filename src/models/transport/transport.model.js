import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    requestedDate: Date,
    handledDate: Date,
    type: {
      type: String,
      enum: ["IMPORT", "EXPORT"]
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "CONFIRMED"],
      default: "PENDING"
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
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
const TransportModel = mongoose.model("Transport", schema);

module.exports = TransportModel;
