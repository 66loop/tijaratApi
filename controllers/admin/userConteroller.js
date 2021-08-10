var User = require('../../models/user')


const getUsers = async (req, res, next) => {
    try {
        let allUsers = await User.find({});
        if (!allUsers) {
            res.status(401).json({ message: "Users Not Found" });
        }
        let filteredUsers = allUsers.map(user => {
            return {
                _id: user._id,
                email: user.email,
                userName: user.firstName,
                name: `${user.firstName} ${user.lastName}`,
                createdAt: user.createdAt,
                status: user.status
            }
        })
        res.status(201).json({ message: "Success", users: filteredUsers })
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

const updateUser = async (userId, userData) => {
    try {
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
    getUserById
}