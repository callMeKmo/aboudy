// all modules.

const Product = require('../models/product')
const Image = require('../models/image')
const Category = require('../models/category')

// controller.

exports.searchOptions = async (req, res, next) => {
    let query = Category.find().sort({ createdAt: 'desc' })
    if (req.query.title != null && req.query.title != '') {
        query = Product.find().sort({ createdAt: 'desc' })
        query = query.regex('title', new RegExp(req.query.title, 'i'))
        req.products = []
        req.results = await query.exec()
        next()
    } else {
        req.categories = []
        req.results = await query.exec()
        next()
    }
}
exports.products = (req, res) => {
    if (req.query.title != null && req.query.title != ''){
        var results = req.results
        var products = req.products
        if ( results.length != 0){
            results.forEach(async function(production) {
                try {
                    let cover = await Image.findOne({owner: production.id}).exec()
                    products[products.length] = [production,cover]
                    if (products.length == results.length){
                        res.render('home', {
                            products: products,
                            categories: [],
                            searchOptions: req.query
                        })
                    }
                } catch {
                    res.cookie('error','err-3100')
                    res.redirect('/')
                }
            })
        } else {
            res.render('home', {
                products: products,
                categories: [],
                searchOptions: req.query
            })
        }
    } else {
        var results = req.results
        var categories = req.categories
        if ( results.length != 0){
            results.forEach(async function(production) {
                try {
                    let cover = await Image.findOne({owner: production.id}).exec()
                    categories[categories.length] = [production,cover]
                    if (categories.length == results.length){
                        res.render('home', {
                            categories: categories,
                            products: [],
                            searchOptions: req.query
                        })
                    }
                } catch {
                    res.cookie('error','err-3200')
                    res.redirect('/')
                }
            })
        } else {
            res.render('home', {
                products: [],
                categories: categories,
                searchOptions: req.query
            })
        }
    }
}