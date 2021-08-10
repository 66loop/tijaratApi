const SubCategory = require('../../models/SubCategory')
const validator = require("fastest-validator");
const bucketurl = require("../../config/BucketUrl");


const createSubCategory = async (req, res, next) => {
    try {
        const createdcategory = {
            name: req.body.name,
            category: req.body.category
        };
        // let images = [];
        // for (let index = 0; index < req.files.length; index++) {
        //     images.push(`${bucketurl}/images/${req.files[index].filename}`);
        // }
        // createdcategory.image = images[0]

        const schema = {
            name: { type: "string", optional: false },
            category: { type: "string", optional: false },
        };

        const v = new validator();
        const validateResponse = v.validate(createdcategory, schema);

        if (validateResponse !== true) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: validateResponse,
            });
        }

        const subCategory = await SubCategory.create(createdcategory).populate('category')
        if (!subCategory) {
            return res.status(201).json({
                message: "SubCategory not found",
                errors: validateResponse,
            });
        }
        return res.status(201).json({
            message: "Success",
            subCategory
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const updateSubCategory = async (req, res, next) => {
    try {
        const updateCategory = {
            name: req.body.name,
        };
        // let images = [];
        // if(req.files.length> 0) {
        //     for (let index = 0; index < req.files.length; index++) {
        //         images.push(`${bucketurl}/images/${req.files[index].filename}`);
        //     }
        //     createdcategory.image = images[0]
    
        // }

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

        const subCategory = await SubCategory.updateOne({_id: req.params.categoryId}, updateCategory)
        if (!subCategory) {
            return res.status(201).json({
                message: "Category not found",
                errors: validateResponse,
            });
        }
        return res.status(201).json({
            message: "Sub Category Updated"
          });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const getAllSubCategories = async (req, res, next) => {
    try {
        const SubCategories = await SubCategory.find({category: req.query.categoryId}).populate('category')
        if (!SubCategories) {
            return res.status(401).json({
                message: "Categories not found"
            })
        }
        res.status(201).json({
            message: "Success",
            SubCategories
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}

const getSubCategoryById = async (req, res, next) => {
    try {
        const subCategory = await SubCategory.findById(req.params.categoryId).populate('category')
        if (!subCategory) {
            return res.status(401).json({
                message: "Category not found"
            })
        }
        return res.status(201).json({
            message: "Sucess",
            subCategory
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}


module.exports = {
    createSubCategory,
    updateSubCategory,
    getAllSubCategories,
    getSubCategoryById
}