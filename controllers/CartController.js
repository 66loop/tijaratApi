const user = require('../models/user');
const validator = require("fastest-validator");
const Product = require('../models/Product');

/********************Add to cart*******************/
exports.addToCart = async function (req, res) {
  const cartItem = {
    productId: req.body.productId,
    qty: req.body.qty,
  };

  const schema = {
    productId: { type: "string", optional: false },
    qty: { type: "number", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(cartItem, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }


  user.findOne({ _id: req.params.userId })
    .then(async (dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {

        const productId = cartItem.productId;
        let updatedCart;

        const previousIndex = dbUser.cart.findIndex(product => {
          return product.productId == productId
        });
        console.log(previousIndex, 'Index');
        if (previousIndex !== -1) {
          const newCart = [];
          for (let index = 0; index < dbUser.cart.length; index++) {
            const element = dbUser.cart[index];
            const dbProduct = await Product.findOne({ _id: element.productId });

            if (element.productId == productId) {
              newCart.push({ ...element, qty: element.qty + 1, sum: (dbProduct.price - (dbProduct.price * (dbProduct.discount / 100))) * (element.qty + 1) }) // Increment qty
            } else {
              newCart.push(product)
            }

          }

          updatedCart = newCart;
        }
        else {
          console.log(cartItem.productId, 'db product');
          const dbProduct = await Product.findOne({ _id: cartItem.productId });
          console.log(dbProduct, 'db product');
          updatedCart = [...dbUser.cart, { qty: cartItem.qty, sum: (dbProduct.price - (dbProduct.price * (dbProduct.discount / 100))) * cartItem.qty, productId: productId }];
        }

        user.updateOne({ _id: req.params.userId }, { $set: { cart: updatedCart } }, { upsert: true })
          .then(updatedUser => {
            res.status(200).json({
              message: "Cart item added",
              user: updatedUser,
            });
          }).catch(err => console.log(err, 'error'));
      }
    })
    .catch((error) => {
      console.log(error, 'error');
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Remove from cart*******************/
exports.removeFromCart = async function (req, res) {
  const cartItem = {
    productId: req.body.productId,
  };

  const schema = {
    productId: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(cartItem, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  user.findOne({ _id: req.params.userId })
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {

        user.updateOne({ _id: req.params.userId }, { "$pull": { "cart": { "productId": cartItem.productId } } }, { safe: true, multi: true })
          .then(updatedUser => {
            res.status(200).json({
              message: "Cart item removed",
              cart: updatedUser.cart,
            });
          }).catch(err => console.log(err, 'error'));
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Add payment method*******************/
exports.getCart = async function (req, res) {
  user.findOne({ _id: req.params.userId })
    .populate('cart.productId')
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        res.status(200).json({
          message: "Cart fetched successfully",
          cart: dbUser.cart,
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

/********************Decrement product count from cart*******************/
exports.decrementProductCountFromCart = async function (req, res) {
  const cartItem = {
    productId: req.body.productId,
  };

  const schema = {
    productId: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(cartItem, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  user.findOne({ _id: req.params.userId })
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {

        let cart = dbUser.cart;

        const previousIndex = cart.findIndex(product => {
          return product.productId == cartItem.productId
        });

        if (cart[previousIndex].qty === 1) {
          res.status(400).json({
            message: "We can't decrease quantity as it's already 1 in count.",
          });
        }
        else {
          cart[previousIndex].qty = cart[previousIndex].qty - 1;
        }
        
        user.updateOne({ _id: req.params.userId }, { cart: cart })
          .then(updatedUser => {
            res.status(200).json({
              message: "Quantity decreased"
            });
          }).catch(err => console.log(err, 'error'));
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

function validateResponse(res, postJson, schema) {
  const v = new validator();
  const validateResponse = v.validate(postJson, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }
}