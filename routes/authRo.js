// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/authCo')
const checkAuth = require('../middleware/checkAuth')

router.get('/login', controller.getAuthLogIn)
router.get('/signup', controller.getAuthSignUp)
router.get('/token', controller.getAuthToken)
router.get('/logout', controller.getAuthLogOut)

router.post('/login', checkAuth.noAuth, controller.postAuthLogInCheckEmpty, controller.postAuthLogInCheckData, controller.postAuthLogInCompleted, controller.postAuthLogInReport)
router.post('/token', controller.postAuthToken)
router.post('/signup', checkAuth.noAuth, controller.postAuthSignUpCheckEmpty, controller.postAuthSignUpCheckExsit, controller.postAuthSignUpCreateUser, controller.postAuthSignUpReport)

router.delete('/logout', checkAuth.token, checkAuth.validDate, controller.deleteAuthLogOut, controller.deleteAuthLogOutReport)

module.exports = router