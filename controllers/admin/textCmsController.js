const validator = require("fastest-validator");
const TextCms = require('../../models/TextCms');

const addTextCmsCode = async (req, res, next) => {
  try {
    const createdTextSection = {
      section: req.body.section,
      key: req.body.key,
      value: req.body.value,
    };

    const schema = {
      section: { type: "string", optional: false },
      key: { type: "string", optional: false },
      value: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(createdTextSection, schema);

    if (validateResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validateResponse,
      });
    }

    const textCms = await TextCms.create(createdTextSection)
    if (!textCms) {
      return res.status(201).json({
        message: "TextCms not founded",
        errors: validateResponse,
      });
    }
    return res.status(201).json({
      message: "Success",
      textCms
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }
}

const updateTextCmsCode = async (req, res, next) => {
  try {
    const updatedTextSection = {
      section: req.body.section,
      key: req.body.key,
      value: req.body.value,
    };

    const schema = {
      section: { type: "string", optional: false },
      key: { type: "string", optional: false },
      value: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(updatedTextSection, schema);

    if (validateResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validateResponse,
      });
    }

    const textCms = await TextCms.updateOne({ _id: req.params.id }, updatedTextSection)
    if (!textCms) {
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

const getAllTextCmsCode = async (req, res, next) => {
  try {
    const TextCmss = await TextCms.find({})
    if (!TextCmss) {
      return res.status(401).json({
        message: "TextCms codes not found"
      })
    }
    res.status(201).json({
      message: "Success",
      codes: TextCmss
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }


}

const getTextCmsCodeById = async (req, res, next) => {
  try {
    const textCms = await TextCms.findById(req.params.id)
    if (!textCms) {
      return res.status(401).json({
        message: "TextCms not found"
      })
    }
    return res.status(201).json({
      message: "Success",
      data: textCms
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }

}

const deletetTextCmsCodeById = async (req, res, next) => {
  try {
    const textCms = await TextCms.deleteOne({ _id: req.params.id })
    if (!textCms) {
      return res.status(401).json({
        message: "TextCms code deleted"
      })
    }
    return res.status(201).json({
      message: "Success",
      data: textCms
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    })
  }

}

module.exports = {
  addTextCmsCode,
  updateTextCmsCode,
  getTextCmsCodeById,
  getAllTextCmsCode,
  deletetTextCmsCodeById
}