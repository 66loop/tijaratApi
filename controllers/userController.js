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
            error: error  
        });
    });

};

exports.getAllUsers = function (req, res, next) {
    models.User.findAll().then(result => {
        if(result){
            res.status(201).json(result);
        } else {
            res.status(201).json({message:"User Not Found"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error  
        });
    });
}

exports.getUserById = function (req, res, next) {
    const id = req.params.userId;
    
    models.User.findByPk(id).then(result => {
        if(result){
            res.status(201).json(result);
        } else {
            res.status(201).json({message:"User Not Found"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error  
        });
    });
}

exports.updateUser = function (req, res, next) {
    const id = req.params.userId;
    const updatedUser = {
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        country:req.body.country,
        city:req.body.city,
        email:req.body.email,
        password:req.body.password,
        userStatusId:req.body.userStatus
    }

    models.User.update(updatedUser, {where: {id:id}}).then(result => {
        if(result){
            res.status(201).json({
                message: "User Updated",
                user: result
            })
        } else {
            res.status(201).json({message:"User Not Found"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error  
        });
    });
}

exports.deleteUser = function(req, res, next) {
    const id = req.params.userId;

    models.User.destroy({where:{id:id}}).then(result => {
        if(result) {
            res.status(201).json({
                message: "User Deleted",
                user: result
            })
        } else {
            res.status(201).json({message:"User Not Found"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error  
        });
    });
}