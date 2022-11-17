import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    importedDate: Date,
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
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
