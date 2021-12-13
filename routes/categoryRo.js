// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/categoriesCo')
const checkAuth = require('../middleware/checkAuth')

router.get('/:id/show', controller.getCategory)
router.get('/all',controller.getAllCategories)
router.use(checkAuth.token,checkAuth.validDate)

router.get('/new', checkAuth.admin, controller.getNewCategory)
router.post('/new', checkAuth.admin, controller.postNewCategoryCreateCategory, controller.postNewCategorySaveImages, controller.postNewCategoryReport)

router.get('/:id/manage', checkAuth.admin, controller.getCategoryManage)
router.post('/:id/update', checkAuth.admin, controller.updateCategoryCheckEmpty, controller.updateCategoryComplete, controller.updateCategoryReport)

module.exports = router