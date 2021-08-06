var User = require('../../models/user')


const getUsers = async () => {
    let allUsers = await User.find();
    if (!allUsers) {
        throw new Error ("Users Not Found" );
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
    return filteredUsers
}

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error ("User Not Found" );
    }
    return user
}

const updateUser = async (userId, userData ) => {
    return User.findOneAndUpdate( {_id: userId}, {...userData});

}

module.exports = {
    getUsers,
    updateUser,
    getUserById
}