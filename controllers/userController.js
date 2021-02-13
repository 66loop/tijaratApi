const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');

exports.register = function(req,res,next){
    const user = {
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        country:req.body.country,
        city:req.body.city,
        email:req.body.email,
        password:req.body.password,
        userStatusId:req.body.userStatus
    }
    
    models.User.create(user).then(result => {
        res.status(201).json({
            message: "User Created Successfully",
            post: result  
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: result  
        });
    });

};

exports.getUserById = function (req, res, next) {
    const isd = req.params.userId;
    models.User().findByPk(id).then(result => {
        res.status(201).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: result  
        });
    });
}