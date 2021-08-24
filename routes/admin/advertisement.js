const express = require('express')
const router = express.Router()
const { addAdvertisementCode, updateAdvertisementCode, getAllAdvertisementCode, getAdvertisementCodeById, deletetAdvertisementCodeById } = require('../../controllers/admin/advertisementController')

router.get('/',  getAllAdvertisementCode);
router.get('/:id',  getAdvertisementCodeById);
router.post('/',  addAdvertisementCode);
router.delete('/:id',  deletetAdvertisementCodeById);
router.put('/:id',  updateAdvertisementCode);


module.exports = router