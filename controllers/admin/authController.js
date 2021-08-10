const User = require('../../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminLogin = async ( req,res,next) => {
    const { email, password } = req.body
    const user = await User.findOne( {email:email})
    if(!user) {
        res.status(401).json("User not found")

    }
    if(user && user.type !== 'admin') {
        res.status(401).json({message: "You are not admin"})
    } 
    bcryptjs.compare(
        password,
        user.password,
        function (err, result) {
          if (result) {
            jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              "secret",
              async function (err, token) {
                res.status(201).send({
                  message: "Authentication successful",
                  token: token,
                  user: user
                });
              }
            );
          }else {
            res.status(401).json({message: "Invalid Credentials"})
          }
        }
      );

}


module.exports = {
    adminLogin,

}