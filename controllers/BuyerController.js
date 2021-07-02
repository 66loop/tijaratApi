const Buyer = require("../models/Buyer");

/********************Registering a Buyer*******************/
exports.register = (user) => {
  return new Promise((resolve, reject) => {
    Buyer.create(user)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.checkIfBuyerExists = (user) => {
  return new Promise((resolve, reject) => {
    Buyer.findOne({ email: user.email })
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/********************Updating a Buyer*******************/
exports.updateBuyer = (buyer) => {
  console.log(buyer, 'buyer')
  return new Promise((resolve, reject) => {
    Buyer.updateOne({ email: buyer.email }, buyer.updatedProps)
      .then((result) => {
        console.log(result, 'result');
        resolve()
      })
      .catch((error) => {
        console.log(error, 'error result');

        reject(error);
      });
  });
};

/********************receive feedback of Buyer*******************/
exports.receiveFeedback = async function (req, res) {
  const { buyerId, review } = req.body;
  console.log(buyerId, 'buyer Id');
  Buyer.findOne({ _id: buyerId })
    .then((result) => {
      if (result) {
        let totalRating = 0;
        if (result.reviews.length > 0) {
          totalRating = (((result.reviews.map(item => item.rating).reduce((prev, next) => prev + next)) + review.rating) / (result.reviews.length + 1)).toFixed(1);
        }
        else {
          totalRating = review.rating;
        }
        let totalReviews = [...result.reviews, review];
        Buyer.updateOne({ _id: buyerId }, { reviews: totalReviews, rating: totalRating })
          .then((buyerUpdated) => {
            res.status(200).json({ message: "Review added" });
          })
          .catch((error) => {
            res.status(500).json({ message: "Something went wrong", error: error.toString() });
          });
      }
      else {
        res.status(201).json({ message: "Buyer Not Found" });
      }

    })
    .catch((error) => {
      res.status(500).json({ message: "Something went wrong", error: error.toString() });
    });
};
