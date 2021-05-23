var mongoose = require("mongoose");

var OrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    masterOrderNumber: Number,
    orders: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
            price: Number,
            total: Number,
            choosenPaymentMethod: {
                type: mongoose.Schema.Types.Mixed
            },
            orderStatus: { type: String, default: 'Processing' },
            childOrderNumber: String,
            paymentDone: { type: Boolean, default: false }
        }
    ],
    overAllOrderStatus: { type: String, default: 'Processing' }
}, { timestamps: true });

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;