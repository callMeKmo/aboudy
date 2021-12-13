// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/brandsCo')
const checkAuth = require('../middleware/checkAuth')

router.get('/:id/show', controller.getBrand)
router.get('/all',controller.getAllBrands)
router.use(checkAuth.token,checkAuth.validDate)

router.get('/new', checkAuth.admin, controller.getNewBrand)
router.post('/new', checkAuth.admin, controller.postNewBrandCreateBrand, controller.postNewBrandSaveImages, controller.postNewBrandReport)

router.get('/:id/manage', checkAuth.admin, controller.getBrandManage)
router.post('/:id/update', checkAuth.admin, controller.updateBrandCheckEmpty, controller.updateBrandComplete, controller.updateBrandReport)

module.exports = router