const Order = require("../models/Orders");
const validator = require("fastest-validator");
const constants = require("../config/constants");

const getOrderNumber = async () => {
    let previousOrders = await Order.countDocuments();
    return constants.constants.orderStartingNumber + (previousOrders + 1);
}

/********************Create Order*******************/
exports.createOrder = async function (req, res) {
    const user = {
        user: req.body.user,
    };

    const schema = {
        user: { type: "string", optional: false },
    };

    if (req.body.cart.length < 1) {
        res.status(401).json({
            message: "Order must contain an item.",
        });
    }

    validateResponse(res, user, schema);

    let dataToBeStored = {
        user: req.body.user,
        masterOrderNumber: await getOrderNumber(),
        orders: []
    }

    // let differentSellers = cart.map(x => x.product.seller._id).filter((value, index, self) => self.indexOf(value) === index);

    for (let index = 0; index < req.body.cart.length; index++) {
        const element = req.body.cart[index];

        const orderIs = {
            product: element.product._id,
            quantity: element.quantity,
            seller: element.product.serllerId._id,
            price: element.product.price,
            total: element.quantity * element.product.price,
            choosenPaymentMethod: element.choosenPaymentMethod,
            childOrderNumber: dataToBeStored.masterOrderNumber + '-' + (index + 1)
        };

        dataToBeStored.orders.push(orderIs);
    }

    Order.create(dataToBeStored).then((response) => {
        res.status(200).json({
            message: "Order created",
            token: dataToBeStored
        });
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong",
            error: error.toString(),
        });
    });
};

/********************Get Order*******************/
exports.getOrder = async function (req, res) {

    Order.find({ "orders.seller": req.params.sellerId })
        .populate('user orders.product orders.seller')
        .then(response => {
            let ordersShouldBe = [];

            for (let index = 0; index < response.length; index++) {
                const element = response[index];

                let differentSellers = element.orders.map(x => x.product.serllerId).filter((value, index, self) => self.indexOf(value) === index);

                if (differentSellers.length > 1) {
                    let ordersSpecificToASeller = element.orders.filter(item => item.product.serllerId.toString() === req.params.sellerId);
                    ordersShouldBe.push({ _id: element._id, user: element.user, masterOrderNumber: element.masterOrderNumber, createdAt: element.createdAt, updatedAt: element.updatedAt, orders: ordersSpecificToASeller });
                }
                else {
                    ordersShouldBe.push(element);
                }
            }

            res.status(200).json({
                message: "Order fetched",
                order: ordersShouldBe
            });

        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error.toString(),
            });
        })
};

/********************Update Order status*******************/
exports.updateOrder = async function (req, res) {

    Order.updateOne({ _id: req.params.orderId, 'orders.seller': req.query.seller }, { 'orders.$.orderStatus': req.query.status })
        .then(response => {
            Order.findOne({ _id: req.params.orderId })
                .then(res1 => {
                    let differentOrderStatus = res1.orders.map(x => x.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

                    if (differentOrderStatus.length > 0 && differentOrderStatus.length < 2) {
                        Order.updateOne({ _id: req.params.orderId }, { 'overAllOrderStatus': differentOrderStatus[0] })
                            .then(response => {
                                res.status(200).json({
                                    message: "Order status has been updated to" + req.query.status
                                });
                            })
                    }
                    else {
                        res.status(200).json({
                            message: "Order status has been updated to" + req.query.status
                        });
                    }
                })
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error.toString(),
            });
        })
};

/********************Get Orders by buyer*******************/
exports.getOrderByUser = async function (req, res) {

    try {
        let incompleteOrders = await Order.find({ $and: [{ user: req.params.userId }, { overAllOrderStatus: { $ne: "Delivered" } }] })
            .populate('user orders.product orders.seller')
            .sort({ createdAt: -1 });
        let completeOrders = await Order.find({ $and: [{ user: req.params.userId }, { overAllOrderStatus: "Delivered" }] })
            .populate('user orders.product orders.seller')
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: "Order fetched by user",
            orders: [...incompleteOrders, ...completeOrders]
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.toString(),
        });
    }



    Order.find({ "orders.seller": req.params.sellerId })
        .populate('user orders.product orders.seller')
        .then(response => {
            let ordersShouldBe = [];

            for (let index = 0; index < response.length; index++) {
                const element = response[index];

                let differentSellers = element.orders.map(x => x.product.serllerId).filter((value, index, self) => self.indexOf(value) === index);

                if (differentSellers.length > 1) {
                    let ordersSpecificToASeller = element.orders.filter(item => item.product.serllerId.toString() === req.params.sellerId);
                    ordersShouldBe.push({ _id: element._id, user: element.user, masterOrderNumber: element.masterOrderNumber, createdAt: element.createdAt, updatedAt: element.updatedAt, orders: ordersSpecificToASeller });
                }
                else {
                    ordersShouldBe.push(element);
                }
            }

            res.status(200).json({
                message: "Order fetched",
                order: ordersShouldBe
            });

        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error.toString(),
            });
        })
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