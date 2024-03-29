const Order = require("../models/Orders");
const validator = require("fastest-validator");
const constants = require("../config/constants");
const emailSending = require('../config/emailSending');

const getOrderNumber = async () => {
    let previousOrders = await Order.countDocuments();
    return constants.constants.orderStartingNumber + (previousOrders + 1);
}

/********************Create Order*******************/
exports.createOrder = async function (req, res) {
    const user = {
        user: req.body.user,
        buyer: req.body.buyer,
    };

    const schema = {
        user: { type: "string", optional: false },
        buyer: { type: "string", optional: false },
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
        orders: [],
        buyer: req.body.buyer,
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
            childOrderNumber: dataToBeStored.masterOrderNumber + '-' + (index + 1),
            paymentDone: (element.paymentEvidence ? (element.paymentEvidence.trxId !== undefined || element.paymentEvidence.trxId !== "" || element.paymentEvidence.screenshot !== "" || element.paymentEvidence.screenshot !== undefined) : false),
            paymentEvidence: element.paymentEvidence,
            buyer: user.buyer
        };

        dataToBeStored.orders.push(orderIs);
    }

    Order.create(dataToBeStored).then((response) => {

        Order.find({ _id: response._id })
            .populate('user orders.product orders.seller orders.buyer')
            .then(responseOrder => {

                res.status(200).json({
                    message: "Order fetched",
                    order: responseOrder
                });

            })
            .catch(error => {
                res.status(500).json({
                    message: "Something went wrong",
                    error: error.toString(),
                });
            })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong",
            error: error.toString(),
        });
    });
};

/********************Get Order*******************/
exports.getOrder = async function (req, res) {

    console.log(req.params.sellerId, 'you');
    Order.find({ "orders.seller": req.params.sellerId })
        .populate('user orders.product orders.seller orders.buyer')
        .then(response => {
            let ordersShouldBe = [];
            console.log(response[0].orders[0], 'response');
            for (let index = 0; index < response.length; index++) {
                const element = response[index];
                console.log(JSON.stringify(element, 'elem'))
                let differentSellers = element.orders.map(x => x.product.seller).filter((value, index, self) => self.indexOf(value) === index);

                if (differentSellers.length > 1) {
                    let ordersSpecificToASeller = element.orders.filter(item => item.product.seller.toString() === req.params.sellerId);
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

/********************Get Order*******************/
exports.getOrderById = async function (req, res) {

    console.log(req.params.orderId, 'you');
    Order.find({ "_id": req.params.orderId })
        .populate('user orders.product orders.seller orders.buyer')
        .then(response => {
            let ordersShouldBe = [];
            console.log(response[0].orders[0], 'response');
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
        let incompleteOrders = await Order.find({ $and: [{ buyer: req.params.userId }, { overAllOrderStatus: { $ne: "Delivered" } }] })
            .populate('user orders.product orders.seller orders.buyer')
            .sort({ createdAt: -1 });
        let completeOrders = await Order.find({ $and: [{ buyer: req.params.userId }, { overAllOrderStatus: "Delivered" }] })
            .populate('user orders.product orders.seller orders.buyer')
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
        .populate('user orders.product orders.seller orders.buyer')
        .then(response => {
            let ordersShouldBe = [];

            for (let index = 0; index < response.length; index++) {
                const element = response[index];

                let differentSellers = element.orders.map(x => x.product.seller).filter((value, index, self) => self.indexOf(value) === index);

                if (differentSellers.length > 1) {
                    let ordersSpecificToASeller = element.orders.filter(item => item.product.seller.toString() === req.params.sellerId);
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

/********************Get Order*******************/
exports.getOrder = async function (req, res) {

    console.log(req.params.sellerId, 'you');
    Order.find({ "orders.seller": req.params.sellerId })
        .populate('user orders.product orders.seller orders.buyer')
        .then(response => {
            let ordersShouldBe = [];
            console.log(response[0].orders[0], 'response');
            for (let index = 0; index < response.length; index++) {
                const element = response[index];
                console.log(JSON.stringify(element, 'elem'))
                let differentSellers = element.orders.map(x => x.product.seller).filter((value, index, self) => self.indexOf(value) === index);

                if (differentSellers.length > 1) {
                    let ordersSpecificToASeller = element.orders.filter(item => item.product.seller.toString() === req.params.sellerId);
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

/********************Get Order*******************/
exports.getOrderByReviewKey = async function (req, res) {

    Order.find({ "reviewKey": req.params.reviewKey })
        .populate('user orders.product orders.seller orders.buyer')
        .then(response => {

            res.status(200).json({
                message: "Order fetched",
                order: response
            });

        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error.toString(),
            });
        })
};

/********************Get Order*******************/
exports.sendEmailForReview = async function () {
    let todayDate = new Date();
    let dateDayBeforeYesterday = new Date();
    dateDayBeforeYesterday.setDate(todayDate.getDate() - 2);

    let orders = await Order.find({ $and: [{ updatedAt: { $lt: todayDate } }, { updatedAt: { $gt: dateDayBeforeYesterday } }, { overAllOrderStatus: "Shipped" }] }).populate('user');


    let body = '<p style="font-size:18px;">Your order has been delivered yesterday, please review the products in order by clicking the link below<br></br></p>' +
        '<p>Click the button below to Give Review.</p>' +
        '<a href="{link}"><button type="button" style="background-color:green;color:white">Give Review</button></a>"' +
        '<br></br><br></br><p>Questions and Queries? Email info@tijarat.co</p><br></br>';
    if (orders.length > 0) {
        for (let index = 0; index < orders.length; index++) {
            try {
                const element = orders[index];

                const reviewKey = Math.random().toString(36).substring(7);

                await Order.updateOne({ _id: element._id }, { reviewKey: reviewKey });
                body = body.replace('{link}', constants.constants.baseUrl + "?reviewKey=" + reviewKey)
                element.user = { email: 'usamadanish22@gmail.com' }
                await emailSending.sendEMessage("Please review product you received", body, element.user && element.user.email ? element.user : { email: "usamadanish22@gmail.com" })
                console.log("email sent")
            } catch (error) {
                console.log(error, 'error')
            }

        }
    }
    console.log("not found any order")
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