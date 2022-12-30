import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
    {
        code: String,
        fullName: String,
        phone: String,
        address: String,
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductInstance'
            },
            branch: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Branch'
            },
            dateBought: {
                type: Date,
                default: new Date()
            },
        }]
    },
    {
        timestamps: true,
    }
);

schema.plugin(paginate);
const CustomerModel = mongoose.model("Customer", schema);

module.exports = CustomerModel;
