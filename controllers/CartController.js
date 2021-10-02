const user = require("../models/user");
const validator = require("fastest-validator");
const Product = require("../models/Product");

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

  user
    .findOne({ _id: req.params.userId })
    .then(async (dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        dbUser = dbUser.toObject();
        const productId = cartItem.productId;
        let updatedCart;

        const previousIndex = dbUser.cart.findIndex((product) => {
          return product.productId == productId;
        });
        console.log(previousIndex, "Index");
        if (previousIndex !== -1) {
          const newCart = [];
          for (let index = 0; index < dbUser.cart.length; index++) {
            const element = dbUser.cart[index];
            console.log(JSON.stringify(element), "element");
            const dbProduct = await Product.findOne({ _id: element.productId });

            console.log(JSON.stringify(dbProduct), "db product");

            if (element.productId == productId) {
              console.log("before pushing");
              newCart.push({
                ...element,
                qty: element.qty + 1,
                sum:
                  (dbProduct.price -
                    dbProduct.price * (dbProduct.discount / 100)) *
                  (element.qty + 1),
              }); // Increment qty
              console.log("after pushing");
            } else {
              newCart.push(element);
            }
          }

          updatedCart = newCart;
        } else {
          console.log(cartItem.productId, "db product");
          const dbProduct = await Product.findOne({ _id: cartItem.productId });
          console.log(dbProduct, "db product");
          updatedCart = [
            ...dbUser.cart,
            {
              qty: cartItem.qty,
              sum:
                (dbProduct.price -
                  dbProduct.price * (dbProduct.discount / 100)) *
                cartItem.qty,
              productId: productId,
            },
          ];
        }

        console.log(JSON.stringify(updatedCart), "updated cart");
        console.log(JSON.stringify(dbUser.cart), "previous cart");
        user
          .updateOne({ _id: req.params.userId }, { cart: updatedCart })
          .then((updatedUser) => {
            res.status(200).json({
              message: "Cart item added",
              user: updatedUser,
            });
          })
          .catch((err) => console.log(err, "error"));
      }
    })
    .catch((error) => {
      console.log(error, "error");
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Add to cart*******************/
exports.addMultipleItemsToCart = async function (req, res) {
  const cart = {
    products: req.body.products,
  };

  user
    .findOne({ _id: req.params.userId })
    .then(async (dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        dbUser = dbUser.toObject();
        let cartToBeUpdated = dbUser.cart;

        for (let index = 0; index < cart.products.length; index++) {
          const element = cart.products[index];
          const productId = element.productId;

          const previousIndex = cartToBeUpdated.findIndex((product) => {
            return product.productId == productId;
          });

          if (previousIndex !== -1) {
              const dbProduct = await Product.findOne({
                _id: element.productId,
              });
              console.log(element.productId, dbProduct._id)
              if (element.productId.toString() == dbProduct._id.toString()) {
                cartToBeUpdated[previousIndex] = {
                  productId: element.productId,
                  qty: cartToBeUpdated[previousIndex].qty + element.qty,
                  sum:
                    (dbProduct.price -
                      dbProduct.price * (dbProduct.discount / 100)) *
                    (cartToBeUpdated[previousIndex].qty + 1),
                };

              }
          } else {
            const dbProduct = await Product.findOne({ _id: element.productId });
            console.log(dbProduct, 'dbProduct');
            cartToBeUpdated = [
              ...cartToBeUpdated,
              {
                qty: element.qty,
                sum:
                  (dbProduct.price -
                    dbProduct.price * (dbProduct.discount / 100)) *
                    element.qty,
                productId: productId,
              },
            ];
          }
        }

        user
          .updateOne({ _id: req.params.userId }, { cart: cartToBeUpdated })
          .then((updatedUser) => {
            res.status(200).json({
              message: "Cart item added",
              user: cartToBeUpdated,
            });
          })
          .catch((err) => console.log(err, "error"));
      }
    })
    .catch((error) => {
      console.log(error, "error");
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

  user
    .findOne({ _id: req.params.userId })
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        user
          .updateOne(
            { _id: req.params.userId },
            { $pull: { cart: { productId: cartItem.productId } } },
            { safe: true, multi: true }
          )
          .then((updatedUser) => {
            res.status(200).json({
              message: "Cart item removed",
              cart: updatedUser.cart,
            });
          })
          .catch((err) => console.log(err, "error"));
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
  user
    .findOne({ _id: req.params.userId })
    .populate([
      {
        path: "cart.productId",
        populate: [
          {
            path: "serllerId",
          },
          {
            path: "category",
          },
          {
            path: "subCategory",
          },
        ],
      },
    ])
    .lean()
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        const cart = [];

        if (dbUser.cart && dbUser.cart.length > 0) {
          for (let index = 0; index < dbUser.cart.length; index++) {
            const element = dbUser.cart[index];

            delete element._id;

            let newObj = {
              ...element.productId,
            };

            delete element.productId;

            cart.push({ ...newObj, ...element });
          }
        }

        res.status(200).json({
          message: "Cart fetched successfully",
          cart: cart,
        });
      }
    })
    .catch((error) => {
      console.log(error, "error");
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

  user
    .findOne({ _id: req.params.userId })
    .then((dbUser) => {
      if (dbUser === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        let cart = dbUser.cart;

        const previousIndex = cart.findIndex((product) => {
          return product.productId == cartItem.productId;
        });

        if (cart[previousIndex].qty === 1) {
          res.status(400).json({
            message: "We can't decrease quantity as it's already 1 in count.",
          });
        } else {
          cart[previousIndex].qty = cart[previousIndex].qty - 1;
        }

        user
          .updateOne({ _id: req.params.userId }, { cart: cart })
          .then((updatedUser) => {
            res.status(200).json({
              message: "Quantity decreased",
            });
          })
          .catch((err) => console.log(err, "error"));
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
