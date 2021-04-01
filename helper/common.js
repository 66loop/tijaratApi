const User = require("../models/User");

const generateRandomUserName = async (name = "user") => {
    const user = await User.findOne({ email: name });
    let result = name;
    if (user) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return generateRandomUserName(result)
    }
    else {
        return result;
    }
}

module.exports = {
    generateRandomUserName
}