const validator = require("fastest-validator");
const Globals = require("../models/Globals");

/********************Create global*******************/
exports.addGlobal = function (req, res, next) {
  const createGlobal = {
    key: req.body.key,
    value: req.body.value,
  };

  const schema = {
    key: { type: "string", optional: false },
    value: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(createGlobal, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  Globals.create(createGlobal)
    .then((result) => {
      if (result) {
        return res.status(201).json({
          message: "Global created",
          Global: result,
        });
      } else {
        return res.status(201).json({ message: "Global Not Found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get globals*******************/
exports.getGlobals = function (req, res, next) {
  Globals.find({})
    .then((result) => {
      if (result) {
        return res.status(201).json({
          message: "Globals fetched",
          Globals: result,
        });
      } else {
        return res.status(201).json({ message: "Globals Not Found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get global by Id*******************/
exports.getGlobalsById = function (req, res, next) {
  Globals.findOne({ _id: req.params.id }).then((result) => {
    if (result) {
      return res.status(201).json({
        message: "Global fetched",
        Global: result,
      });
    } else {
      return res.status(201).json({ message: "Global Not Found" });
    }
  })
  .catch((error) => {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  });
};

/********************Get global by key*******************/
exports.getGlobalsByKey = function (req, res, next) {
  Globals.findOne({ key: req.params.id }).then((result) => {
    if (result) {
      return res.status(201).json({
        message: "Global fetched",
        Global: result,
      });
    } else {
      return res.status(201).json({ message: "Global Not Found" });
    }
  })
  .catch((error) => {
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  });
};

/********************Update Globals*******************/
exports.updateGlobals = function (req, res, next) {
  const id = req.params.id;
  const updatedGlobal = {
    key: req.body.key,
    value: req.body.value,
  };

  const schema = {
    key: { type: "string", optional: false },
    value: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(updatedGlobal, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  Globals.updateOne({ _id: id }, updatedGlobal)
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "Global Updated",
          Global: result,
        });
      } else {
        res.status(201).json({ message: "Global Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Delete Globals*******************/
exports.deleteGlobal = function (req, res, next) {
  const id = req.params.id;

  Globals.deleteOne({ _id: id })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "Globals Deleted",
          Globals: result,
        });
      } else {
        res.status(201).json({ message: "Globals Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};
