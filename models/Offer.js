var mongoose = require("mongoose");

var offerSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    color: { type: String },
    priceOfferedFromSeller: { type: Number },
    priceOfferedFromBuyer: { type: Number },
    status: { type: String, default: "Offerred" }
}, { timestamps: true });

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
