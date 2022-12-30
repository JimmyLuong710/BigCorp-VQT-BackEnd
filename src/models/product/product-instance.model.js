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
            enum: [
                'NEWLY_PRODUCED',
                'IMPORTED_STORE',
                'TAKE_TO_DISTRIBUTOR',
                'SOLD',
                'FAILED_NEED_TO_WARRANTY',
                "UNDER_WARRANTY",
                "WARRANTY_DONE",
                'WARRANTY_RETURNED_TO_CUSTOMER',
                "FAILED_NEED_TO_FACTORY",
                "FAILED_SENT_TO_FACTORY",
                "FAILED_NEED_TO_SUMMON",
                "RETURNED_TO_FACTORY"
            ],
            default: "NEWLY_PRODUCED"
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch'
        },
        progress: [
            {
                action: {
                    enum: [
                        'NEWLY_PRODUCED',
                        'IMPORTED_STORE',
                        'TAKE_TO_DISTRIBUTOR',
                        'SOLD',
                        'FAILED_NEED_TO_WARRANTY',
                        "UNDER_WARRANTY",
                        "WARRANTY_DONE",
                        'WARRANTY_RETURNED_TO_CUSTOMER',
                        "FAILED_NEED_TO_FACTORY",
                        "FAILED_SENT_TO_FACTORY",
                        "FAILED_NEED_TO_SUMMON",
                        "RETURNED_TO_FACTORY"
                    ],
                    type: String
                },
                date: {
                    type: Date,
                    default: new Date()
                },
                location: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Branch'
                },
                customer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Customer",
                },
                note: String,
            },
        ],
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
