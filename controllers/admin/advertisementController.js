const validator = require("fastest-validator");
const Advertisement = require('../../models/Advertisement');

const addAdvertisementCode = async (req, res, next) => {
  try {
    const createdCodeSnippet = {
      for: req.body.for,
      description: req.body.description,
      codeSnippet: req.body.codeSnippet
    };

    const schema = {
      for: { type: "string", optional: false },
      codeSnippet: { type: "string", optional: false },
      description: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(createdCodeSnippet, schema);

    if (validateResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validateResponse,
      });
    }

    const advertisement = await Advertisement.create(createdCodeSnippet)
    if (!advertisement) {
      return res.status(201).json({
        message: "Advertisement not founded",
        errors: validateResponse,
      });
    }
    return res.status(201).json({
      message: "Success",
      advertisement
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }
}

const updateAdvertisementCode = async (req, res, next) => {
  try {
    const updatedCodeSnippet = {
      for: req.body.for,
      description: req.body.description,
      codeSnippet: req.body.codeSnippet
    };

    const schema = {
      for: { type: "string", optional: false },
      description: { type: "string", optional: false },
      codeSnippet: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(updatedCodeSnippet, schema);

    if (validateResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validateResponse,
      });
    }

    const advertisement = await Advertisement.updateOne({ _id: req.params.id }, updatedCodeSnippet)
    if (!advertisement) {
      return res.status(201).json({
        message: "Code Snippet not found",
      });
    }
    return res.status(201).json({
      message: "Code Snippet Updated"
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }

}

const getAllAdvertisementCode = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find({})
    if (!advertisements) {
      return res.status(401).json({
        message: "Advertisement codes not found"
      })
    }
    res.status(201).json({
      message: "Success",
      codes: advertisements
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }


}

const getAdvertisementCodeById = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id)
    if (!advertisement) {
      return res.status(401).json({
        message: "Advertisement not found"
      })
    }
    return res.status(201).json({
      message: "Success",
      data: advertisement
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }

}

const deletetAdvertisementCodeById = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.deleteOne({ _id: req.params.id })
    if (!advertisement) {
      return res.status(401).json({
        message: "Advertisement code deleted"
      })
    }
    return res.status(201).json({
      message: "Success",
      data: advertisement
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }

}

module.exports = {
  addAdvertisementCode,
  updateAdvertisementCode,
  getAdvertisementCodeById,
  getAllAdvertisementCode,
  deletetAdvertisementCodeById
}