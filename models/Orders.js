var mongoose = require("mongoose");

var OrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' },
    masterOrderNumber: Number,
    orders: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
            buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' },
            price: Number,
            total: Number,
            choosenPaymentMethod: {
                type: mongoose.Schema.Types.Mixed
            },
            orderStatus: { type: String, default: 'Processing' },
            childOrderNumber: String,
            paymentDone: { type: Boolean, default: false },
            paymentEvidence: {
                trxId: { type: String },
                screenshot: { type: String }
            }
        }
    ],
    overAllOrderStatus: { type: String, default: 'Processing' },
    reviewKey: { type: String }
}, { timestamps: true });

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;