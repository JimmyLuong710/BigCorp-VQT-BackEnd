import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
    {
        code: {
          type: String,
          default: 'ST' + ((Math.random() + 1).toString(36).substring(7)) + '-' + Math.round(((Math.random() + 1) * 10000))
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
        },
        type: {
            type: String,
            enum: ["IMPORTED", "EXPORTED", "SOLD", "FIXED", "PRODUCED"],
        },
        handleType: String,
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductInstance",
            },
        ],
        note: String,
        date: {
            type: Date,
            default: new Date()
        }
    },
    {
        timestamps: true,
        collection: 'branch-trackings'
    }
);

schema.plugin(paginate);
const BranchTrackingModel = mongoose.model("BranchTracking", schema);

module.exports = BranchTrackingModel;
