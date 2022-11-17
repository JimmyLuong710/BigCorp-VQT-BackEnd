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
const AccountModel = mongoose.model("Account", schema);

module.exports = AccountModel;
