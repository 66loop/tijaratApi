const express = require('express')
const router = express.Router()
const { addTextCmsCode, deletetTextCmsCodeById, getAllTextCmsCode, getTextCmsCodeById, updateTextCmsCode } = require('../../controllers/admin/textCmsController')

router.get('/',  getAllTextCmsCode);
router.get('/:id',  getTextCmsCodeById);
router.post('/',  addTextCmsCode);
router.delete('/:id',  deletetTextCmsCodeById);
router.put('/:id',  updateTextCmsCode);


module.exports = router