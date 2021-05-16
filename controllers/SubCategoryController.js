const validator = require("fastest-validator");
const SubCategory = require("../models/SubCategory");

/********************get sub categories by category*******************/
exports.getSubCategoriesByCategory = (category) => {
    SubCategory.find({ category });
};

/********************Add sub category to a category*******************/
exports.addSubCategoryToCategory = function (req, res, next) {
    SubCategory
        .insertMany(req.body.subCategories)
        .then((result) => {
            if (result) {
                res.status(201).json(result);
            } else {
                res.status(201).json({ message: "category Not Found" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
};

/********************Update category*******************/
exports.updateSubCategory = function (req, res, next) {
    const id = req.params.subcategoryid;
    const updatedcategory = {
        name: req.body.name
    };

    const schema = {
        name: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(updatedcategory, schema);

    if (validateResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: validateResponse,
        });
    }

    SubCategory
        .updateOne({ _id: id }, updatedcategory)
        .then((result) => {
            if (result) {
                res.status(201).json({
                    message: "category Updated",
                    category: result,
                });
            } else {
                res.status(201).json({ message: "category Not Found" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
};

/********************Delete category*******************/
exports.deletecategory = function (req, res, next) {
    const id = req.params.subcategoryid;

    SubCategory
        .deleteOne({ _id: id })
        .then((result) => {
            if (result) {
                res.status(201).json({
                    message: "sub category Deleted",
                    category: result,
                });
            } else {
                res.status(201).json({ message: "sub category Not Found" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
};

/********************Create category*******************/
exports.createSubCategory =  (listOfSubCategories) => {
   return SubCategory.insertMany(listOfSubCategories);
};
