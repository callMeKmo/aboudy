// express, controllers, middlewares.

const express = require('express')
const router = express.Router()
const controller = require('../controllers/homeCo')

router.get('/', controller.searchOptions, controller.products)

module.exports = router