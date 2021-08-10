const Category = require('../../models/Category')
const validator = require("fastest-validator");
const bucketurl = require("../../config/BucketUrl");


const createCategory = async (req, res, next) => {
    try {
        const createdcategory = {
            name: req.body.name
        };
        let images = [];
        for (let index = 0; index < req.files.length; index++) {
            images.push(`${bucketurl}/images/${req.files[index].filename}`);
        }
        createdcategory.image = images[0]

        const schema = {
            name: { type: "string", optional: false },
        };

        const v = new validator();
        const validateResponse = v.validate(createdcategory, schema);

        if (validateResponse !== true) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: validateResponse,
            });
        }

        const category = await Category.create(createdcategory)
        if (!category) {
            return res.status(201).json({
                message: "Category not found",
                errors: validateResponse,
            });
        }
        return res.status(201).json({
            message: "Success",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}


const updateCategory = async (req, res, next) => {
    try {
        const updateCategory = {
            name: req.body.name
        };
        let images = [];
        if(req.files.length> 0) {
            for (let index = 0; index < req.files.length; index++) {
                images.push(`${bucketurl}/images/${req.files[index].filename}`);
            }
            createdcategory.image = images[0]
    
        }

        const schema = {
            name: { type: "string", optional: false },
        };

        const v = new validator();
        const validateResponse = v.validate(updateCategory, schema);

        if (validateResponse !== true) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: validateResponse,
            });
        }

        const category = await Category.updateOne({_id: req.params.categoryId}, updateCategory)
        if (!category) {
            return res.status(201).json({
                message: "Category not found",
                errors: validateResponse,
            });
        }
        return res.status(201).json({
            message: "Category Updated"
          });
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }

}

const getAllcategories = async (req, res, next) => {
    try {
        const categories = await Category.find({})
        if (!categories) {
            return res.status(401).json({
                message: "Categories not found"
            })
        }
        res.status(201).json({
            message: "Success",
            categories
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }


}

const getcategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId)
        if (!category) {
            return res.status(401).json({
                message: "Category not found"
            })
        }
        return res.status(201).json({
            message: "Sucess",
            category
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }

}


module.exports = {
    createCategory,
    updateCategory,
    getAllcategories,
    getcategoryById
}