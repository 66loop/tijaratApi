const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const SubCategoryController = require("./SubCategoryController");

const categories = () => {
  return Category.find()
    // .then(async (result) => {
    //   let categories = [];
    //   for (let index = 0; index < result.length; index++) {
    //     const element = result[index];
    //     let subCategories = await SubCategory.find({ category: element._id });

    //     categories.push({
    //       category: element,
    //       subCategories: subCategories
    //     });
    //   }
    //   res.status(201).json(categories);

    // })
}

exports.categories = () => {
  return Category.find();
}

exports.subCategories = () => {
  return SubCategory.find();
}
/********************categorys List*******************/
exports.getAllcategories = function (req, res, next) {
  categories()
    .then(async (result) => {
      let categories = [];
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        let subCategories = await SubCategory.find({ category: element._id });

        categories.push({
          category: element,
          subCategories: subCategories
        });
      }
      res.status(201).json(categories);

    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get category By Id*******************/
exports.getcategoryById = function (req, res, next) {
  const id = req.params.categoryid;
  console.log(id, 'id');
  Category
    .findOne({ _id: id })
    .then(async (result) => {
      if (result) {
        let category = {
          category: result
        };
        let subCategories = await SubCategory.find({ category: result._id });
        category.subCategories = subCategories;
        res.status(201).json(category);
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
exports.updatecategory = function (req, res, next) {
  const id = req.params.categoryid;
  const updatedcategory = {
    name: req.body.name,
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
    .updateMany({}, {image:  "http://159.65.99.140:9000/images/20210714015258607category.jpg"})
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
  const id = req.params.categoryid;

  Category
    .deleteOne({ _id: id })
    .then((result) => {
      if (result) {
        SubCategory.deleteMany({category: id}).then(resp => {
          res.status(201).json({
            message: "category Deleted",
            category: result,
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Something went wrong",
            error: err.toString(),
          });
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

/********************Create category*******************/
exports.createcategory = function (req, res, next) {
  const createdcategory = {
    name: req.body.name
  };

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

  Category
    .create(createdcategory)
    .then((result) => {
      let subCategories = [];
      for (let index = 0; index < req.body.subCategories.length; index++) {
        const element = req.body.subCategories[index];

        subCategories.push({
          category: result._id,
          name: element
        });

      }

      SubCategoryController.createSubCategory(subCategories)
        .then(subCategoriesDone => {
          console.log(subCategoriesDone, "sub categories");
          res.status(201).json({
            message: "category created",
            category: result,
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Something went wrong",
            error: err.toString(),
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};
