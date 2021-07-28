const validator = require("fastest-validator");
const bucketurl = require("../config/BucketUrl");
const Offer = require('../models/Offer');
const constants = require("../config/constants");
const emailSending = require('../config/emailSending');
const Seller = require("../models/Seller");

/********************Get all offers of seller*******************/
exports.getForSeller = function (req, res, next) {
  Offer
    .find({ seller: req.params.sellerId })
    .populate('user buyer seller item')
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "Offers Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get an offer*******************/
exports.getOffer = function (req, res, next) {
  Offer
    .findOne({ _id: req.params.offerId })
    .populate('user buyer seller item')
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "Offer Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Update offer*******************/
exports.acceptOrRejectBySeller = async function (req, res, next) {
  const id = req.params.offerId;
  const accepted = req.params.rejected === "true" ? true : false;


  if (accepted) {
    let offerInDb = await Offer.findOne({ _id: id }).populate('user buyer seller item');

    let offersForSameItem = await Offer.find({ status: "OfferAcceptedBySeller", item: offerInDb._id });

    if (offersForSameItem.length >= offerInDb.item.stock) {

      let otherOffers = await Offer.find({ $or: [{ status: "Offerred" }, { status: "counterOfferBySeller" }], item: offerInDb._id });

      for (let index = 0; index < otherOffers.length; index++) {
        const offerShouldBeRejected = otherOffers[index];

        let body = '<p style="font-size:18px;">We can not proceed with your offer as this item has been sold out ' + offerShouldBeRejected.item.name + '.<br></br></p>' +
          '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';
        await Offer.deleteOne({ _id: id });
        await emailSending.sendEMessage("Offer finished", body, offerFound.buyer && offerFound.buyer.email ? offerFound.buyer : { email: "usamadanish22@gmail.com" });
      }

      res.status(200).json({ message: "You have accepted the offers in same quantity as you have in your stock, so you can't accept more offers." });
    }
  }

  Offer
    .updateOne({ _id: id }, { status: accepted ? "OfferAcceptedBySeller" : "OfferRejectedBySelller" })
    .then((result) => {
      if (result.n) {

        Offer
          .findOne({ _id: id })
          .populate('user buyer seller item')
          .then(async (offerFound) => {
            offerInDb = offerFound;
            if (offerFound) {
              let body;
              if (accepted) {
                body = '<p style="font-size:18px;">Your offer has been accepted again this product ' + offerFound.item.name + '<br></br></p>' +
                  '<p>Click the button below to proceed with transaction.</p>' +
                  '<a href="' + constants.constants.actualBaseUrl + '?"'+offerFound._id+'"><button type="button" style="background-color:green;color:white">Checkout</button></a>"' +
                  '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';
              }
              else {
                body = '<p style="font-size:18px;">Your offer has been rejected again this product ' + offerFound.item.name + ' by seller<br></br></p>' +
                  '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';
              }


              await emailSending.sendEMessage(accepted ? "Offer accepted" : "Offer rejected", body, offerFound.buyer && offerFound.buyer.email ? offerFound.buyer : { email: "usamadanish22@gmail.com" });


              res.status(201).json(offerFound);
            } else {
              res.status(201).json({ message: "Offer Not Found" });
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });

      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Update offer*******************/
exports.acceptOrRejectByBuyer = async function (req, res, next) {
  const id = req.params.offerId;
  const accepted = req.params.rejected === "true" ? true : false;

  if (accepted) {
    let offerInDb = await Offer.findOne({ _id: id }).populate('user buyer seller item');

    let offersForSameItem = await Offer.find({ status: "counterOfferBySeller", item: offerInDb._id });

    if (offersForSameItem.length >= offerInDb.item.stock) {

      let otherOffers = await Offer.find({ $or: [{ status: "Offerred" }, { status: "counterOfferBySeller" }], item: offerInDb._id });

      for (let index = 0; index < otherOffers.length; index++) {
        const offerShouldBeRejected = otherOffers[index];

        let body = '<p style="font-size:18px;">We can not proceed with your offer as this item has been sold out ' + offerShouldBeRejected.item.name + '.<br></br></p>' +
          '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';
        await Offer.deleteOne({ _id: id });
        await emailSending.sendEMessage("Offer finished", body, offerFound.buyer && offerFound.buyer.email ? offerFound.buyer : { email: "usamadanish22@gmail.com" });
      }

      res.status(200).json({ message: "You have accepted the offers in same quantity as you have in your stock, so you can't accept more offers." });
    }

    Offer
      .updateOne({ _id: id }, { status: accepted ? "OfferAcceptedByBuyer" : "OfferRejectedByBuyer" })
      .then((result) => {
        if (result.n) {

          res.status(201).json("Offer" + accepted ? "Accepted" : "rejected");

        } else {
          res.status(500).json({ message: "Something went wrong" });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong",
          error: error,
        });
      });


  }
  else {
    Offer.deleteOne({ _id: id })
      .then((result) => {
        res.status(201).json("Offer rejected");
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong",
          error: error,
        });
      });
  }

};

/********************Update offer*******************/
exports.counterOfferBySeller = function (req, res, next) {
  const id = req.params.offerId;
  const price = req.params.price;

  Offer
    .updateOne({ _id: id }, { status: "counterOfferBySeller", priceOfferedFromSeller: price })
    .then((result) => {
      if (result.n) {
        Offer
          .findOne({ _id: id })
          .populate('user buyer seller item')
          .then(async (offerFound) => {
            if (offerFound) {
              let body;
              body = '<p style="font-size:18px;">You got an counter offer against this product => ' + offerFound.item.name + '<br></br></p>' +
                '<p>Click the button below to proceed with transaction.</p>' +
                '<a href="' + constants.constants.actualBaseUrl + '?"'+offerFound._id+'"><button type="button" style="background-color:green;color:white">Checkout</button></a>"' +
                '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';

              await emailSending.sendEMessage("Counter Offer", body, offerFound.buyer && offerFound.buyer.email ? offerFound.buyer : { email: "usamadanish22@gmail.com" });

              res.status(201).json(offerFound);
            } else {
              res.status(201).json({ message: "Offer Not Found" });
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Create Offer*******************/
exports.create = function (req, res, next) {
  const createOffer = {
    user: req.body.user,
    buyer: req.body.buyer,
    seller: req.body.seller,
    item: req.body.item,
    quantity: req.body.quantity,
    color: req.body.color,
    priceOfferedFromBuyer: req.body.priceOfferedFromBuyer,
  };

  const schema = {
    user: { type: "string", optional: false },
    buyer: { type: "string", optional: false },
    seller: { type: "string", optional: false },
    item: { type: "string", optional: false },
    quantity: { type: "number", optional: false },
    color: { type: "string", optional: true },
    priceOfferedFromBuyer: { type: "number", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(createOffer, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  Offer
    .create(createOffer)
    .then((result) => {
      if (result) {

        Offer
          .findOne({ _id: result._id })
          .populate('user buyer seller item')
          .then(async (offerFound) => {
            if (offerFound) {
              let body = '<p style="font-size:18px;">An offer has been made by a buyer to your product ' + offerFound.item.name + '<br></br></p>' +
                '<p>Click the button below to accept/reject/counter offer.</p>' +
                '<a href="' + constants.constants.actualBaseUrl + '/vendor/vendor-dashboard"><button type="button" style="background-color:green;color:white">Go to dashboard</button></a>"' +
                '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';

              await emailSending.sendEMessage("New offer", body, offerFound.seller && offerFound.seller.email ? offerFound.seller : { email: "usamadanish22@gmail.com" });

              res.status(201).json(offerFound);
            } else {
              res.status(201).json({ message: "Offer Not Found" });
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });

      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Cron-job to expire offer after 24*******************/
exports.expireOffers = async function (req, res, next) {
  try {
    const lasDay = new Date((new Date()) - 24 * 60 * 60 * 1000);

    let offers = await Offer.find({ $and: [{ status: "Offerred" }, { createdAt: { $lt: lasDay } }] })

    if (offers.length) {
      for (let index = 0; index < offers.length; index++) {
        const element = offers[index];
        const review = {
          "rating": 1,
          "ratingText": "Penalty by admin for not responding to offer",
          "order": "",
          "user": element.buyer
        }

        const seller = await Seller.findOne({ _id: element.seller });

        if (seller) {
          let totalRating = 0;
          if (seller.reviews.length > 0) {
            totalRating = (((seller.reviews.map(item => item.rating).reduce((prev, next) => prev + next)) + 1) / (seller.reviews.length + 1)).toFixed(1);
          }
          else {
            totalRating = 1;
          }
          let totalReviews = [...seller.reviews, review];
          await Seller.updateOne({ _id: element.seller }, { reviews: totalReviews, rating: totalRating });
          await Offer.deleteOne({ _id: id });
        }
      }
    }
  } catch (error) {
    console.log(error.toString(), 'error');
  }

};





