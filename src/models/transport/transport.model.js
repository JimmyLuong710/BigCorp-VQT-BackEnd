import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema(
    {
        code: {
            type: String,
            default: 'ST' + ((Math.random() + 1).toString(36).substring(7)) + '-' + Math.round(((Math.random() + 1) * 10000))
        },
        requestedDate: {
            type: Date,
            default: new Date()
        },
        handledDate: Date,
        type: {
            type: String,
            enum: [
                'TAKE_TO_DISTRIBUTOR_BY_FACTORY',
                'TAKE_TO_DISTRIBUTOR_BY_WARRANTY_CENTER',
                'FAILED_NEED_TO_WARRANTY',
                "FAILED_SENT_TO_FACTORY",
                "RETURNED_TO_FACTORY"
            ],
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
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductInstance",
            },
        ],
        note: String
    },
    {
        timestamps: true,
    }
);

schema.plugin(paginate);
const TransportModel = mongoose.model("Transport", schema);

module.exports = TransportModel;
