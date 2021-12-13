// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/productsCo')
const checkAuth = require('../middleware/checkAuth')

router.get('/:id/show', controller.getProduct)
router.get('/:id/order', controller.getProduct)

router.use(checkAuth.token,checkAuth.validDate)

router.get('/new', checkAuth.admin, controller.getNewProduct)
router.get('/:id/manage', checkAuth.admin,controller.getProductManage)

router.post('/:id/order', controller.orderProduct)
router.post('/new', checkAuth.admin, controller.postNewProductCreateProduct, controller.postNewProductSaveImages, controller.postNewProductReport)
router.post('/:id/update', checkAuth.admin, controller.updateProductComplete, controller.updateProductReport)

router.delete('/:id/delete', checkAuth.admin, controller.removeProduct, controller.removeProductReport)

module.exports = router