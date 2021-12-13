// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersCo')
const checkAuth = require('../middleware/checkAuth')

router.use(checkAuth.token,checkAuth.validDate)

router.get('/message',controller.message)
router.get('/inbox',controller.getUserInbox)
router.get('/:id/show',controller.showMessage)
router.get('/cart', controller.getCart)

router.post('/message', controller.postMessage)
router.post('/:id/order', controller.postOrder)

router.delete('/cart/:id',controller.deleteCartItem)
router.delete('/manage/delete',controller.deleteUser, controller.deleteUserReport)

module.exports = router