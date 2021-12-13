// npm modules, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminCo')
const checkAuth = require('../middleware/checkAuth')

router.use(checkAuth.token,checkAuth.validDate,checkAuth.admin)

router.get('/adminPanel', controller.getAdminPanel)
router.get('/manageUsers', controller.getAdminManage)
router.get('/orders', controller.getAdminOrders)
router.get('/reports', controller.getAdminReports)
router.get('/:id/show', controller.getReport)

router.delete('/manageUsers/:id/', controller.deleteUser)

module.exports = router