import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      unique: true
    },
    branchType: {
      type: String,
      enum: ["FACTORY", "DISTRIBUTOR", "WARRANTY_CENTER"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    members: {
      type: Number,
      required: true,
    },
    stores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    }]
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const BranchModel = mongoose.model("Branch", schema);

module.exports = BranchModel;
