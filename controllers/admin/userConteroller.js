var User = require('../../models/user')
var Seller = require('../../models/Seller')
var emailSending = require('../../config/emailSending');


const getUsers = async (req, res, next) => {
    try {
        let allUsers = await User.find({});
        if (!allUsers) {
            res.status(401).json({ message: "Users Not Found" });
        }
        res.status(201).json({ message: "Success", users: allUsers })
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

const getSellers = async (req, res, next) => {
    try {
        let allUsers = await User.find({ registeredAsSeller: true }).lean();
        if (!allUsers) {
            res.status(401).json({ message: "Sellers Not Found" });
        }

        const usersWithSellers = [];

        for (let index = 0; index < allUsers.length; index++) {
            const element = allUsers[index];
            const seller = await Seller.findOne({ email: element.email });

            if (element && seller) {
                usersWithSellers.push({
                    user: element,
                    seller: seller
                })
            }

        }

        res.status(201).json({ message: "Success", users: usersWithSellers })
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

const getUserById = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
        }
        res.status(201).json({ message: "Success", user })
    } catch (error) {
        res.status(500).json({ message: error })

    }
}

const updateSellerVerfication = async (req, res, next) => {
    try {

        const user = await Seller.findById(req.params.sellerId);
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
        }
        await Seller.updateOne({ _id: req.params.sellerId }, { verified: req.params.status })

        let body = "Your identification has been";

        if (req.params.status === 'true') {
            body = body + " approved, now you have become a trusted seller.";
        }
        else {
            body = body + " rejected, please try with clear identification proof.";
        }

        await emailSending.sendEMessage("Verification status", body, { email: user.email })

        res.status(201).json({ message: "Success", user })
    } catch (error) {
        res.status(500).json({ message: error })

    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const userData = req.body
        let user = await User.findOneAndUpdate({ _id: userId }, { ...userData });
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
        }
        res.status(201).json({ message: "Success", user })

    } catch (error) {
        res.status(500).json({ message: error })

    }
}

module.exports = {
    getUsers,
    updateUser,
    getUserById,
    getSellers,
    updateSellerVerfication
}