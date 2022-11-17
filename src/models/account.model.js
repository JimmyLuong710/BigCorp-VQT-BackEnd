import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      private: true,
      trim: true,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "WARRANTY", "DISTRIBUTOR", "PRODUCER"],
      trim: true,
      required: true
    }, 
    refreshToken: String
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
const AccountModel = mongoose.model("Account", schema);

module.exports = AccountModel;
