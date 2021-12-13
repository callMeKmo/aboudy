// all modules.

const Category = require('../models/category')
const Image = require('../models/image')
const Product = require('../models/product')
const Report = require('../models/report')
const User = require('../models/user')
const imageMimeTypes = ['image/jpeg', 'image/png']

// controllers.

exports.getCategory = async (req,res) => {
    try {
        const username = req.cookies.username
        const token = req.cookies.refreshToken
        const category = await Category.findById(req.params.id).exec()
        const images = await Image.find({owner: req.params.id}).exec()
        var catProducts = []
        const params = {}
        const products = await Product.find({category: req.params.id}).exec()
        if (products.length != 0){
            products.forEach(async function(production) {
                try {
                    let cover = await Image.findOne({owner: production.id}).exec()
                    catProducts[catProducts.length] = [production,cover]
                    if (catProducts.length == products.length){
                        params.products = catProducts
                        if (username != null && username != undefined) {
                            const user = await User.find({ username: username, token: token}).exec()
                            params.checkAdmin = user[0].isAdmin
                        } else params.checkAdmin = undefined
                        if (category == null || category == undefined) {
                            res.cookie('err-3201')
                            res.redirect('/c/all')
                        }
                        params.category = category
                        params.images = images
                        res.render('categories/show', params)
                    }
                } catch {
                    res.cookie('error','err-3202')
                    res.redirect('/c/all')
                }
            })
        } else {
            if (username != null && username != undefined) {
                const user = await User.find({ username: username, token: token}).exec()
                params.checkAdmin = user[0].isAdmin
            } else params.checkAdmin = undefined
            if (category == null || category == undefined){
                res.cookie('error','err-3201')
                res.redirect('/c/all')
            }
            params.category = category
            params.images = images
            params.products = catProducts
            res.render('categories/show', params)
        }
    } catch {
        res.cookie('error','err-3202')
        res.redirect('/c/all')
    }
}

exports.getCategoryManage = async (req,res) => {
    if (req.cookies.username && req.cookies.refreshToken){
        try {
            const username = req.cookies.username
            const token = req.cookies.refreshToken
            const category = await Category.findById(req.params.id).exec()
            const images = await Image.find({owner: req.params.id}).exec()
            const params = {}
            if (username != null && username != undefined) {
                const user = await User.find({ username: username, token: token}).exec()
                params.checkAdmin = user[0].isAdmin
            } else params.checkAdmin = undefined
            if (category == null || category == undefined) {
                res.cookie('error','err-3201')
                res.redirect('./show')
            }
            params.category = category
            params.images = images
            res.render('categories/manage', params)
        } catch {
            res.cookie('error','err-3203')
            res.redirect('./show')
        }
    } else {
        res.cookie('error','err-3404')
        res.redirect('/')
    }
}

exports.getNewCategory = (req, res) => {
    res.render('categories/new')
}

exports.getAllCategories = async(req,res) => {
    const rawCategories = await Category.find().sort({ createdAt: 'desc' }).exec()
    var categories = []
    if (rawCategories.length == 0){
        const params = {categories:categories}
        res.render('categories/allCategories',params)
    }
    rawCategories.forEach(async category=>{
        const image = await Image.find({owner: category.id}).exec()
        categories[categories.length] = {category: category,image: image[0]}
        if (rawCategories.length == categories.length){
            const params = {categories:categories}
            res.render('categories/allCategories',params)
        }
    })
}

exports.postNewCategoryCreateCategory = async (req, res,next) => {
    if (req.body.title == null || req.body.title === '') {
        res.cookie('error','err-2102')
        res.redirect('/c/new')
    }
    if (req.body.description == null || req.body.description === '') {
        res.cookie('error','err-2103')
        res.redirect('/c/new')
    }
    const category = new Category({
        title: req.body.title,
        description: req.body.description,
    })
    const newCategory = await category.save()
    req.newCategory = newCategory
    next()
}

exports.postNewCategorySaveImages = async (req, res,next) => {
    try {
        var newCategory = req.newCategory
        if (typeof req.body.images === 'object'){
            let images = req.body.images
            images = images.reverse()
            var checkMain = false,i = 0
            images.forEach(async function(imageCode) {
                i++
                try {
                    if (i == 1) checkMain = true
                    else checkMain = false
                    saveImage(new Image(),imageCode,newCategory.id,checkMain)
                } catch{
                    res.cookie('error','err-2600')
                    res.redirect('/c/new')
                }
            })
        } else {
            let imageCode = req.body.images
            saveImage(new Image(),imageCode,newCategory.id,true)
        }
        next()
    } catch {
        res.cookie('error','err-2601')
        res.redirect('/c/new')
    }
}
exports.postNewCategoryReport = async (req, res) => {
    var newCategory = req.newCategory
    const report = new Report({
        title:'category added',
        action:`id : ${newCategory.id},reason : ${req.body.reason}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect(`./${newCategory.id}/show`)
}
exports.updateCategoryCheckEmpty = (req, res, next) => {
    if ( req.body.title == null || req.body.title === '') return res.cookie('error','err-2102'),res.redirect('./show')
    if ( req.body.description == null || req.body.description === '') return res.cookie('error','err-2103'),res.redirect('./show')
    next()
}
exports.updateCategoryComplete = async(req, res,next) => {
    try {
        const category = await Category.findById(req.params.id).exec()
        const image = await Image.findOne({owner: category.id}).exec()
        category.title = req.body.title
        category.description = req.body.description
        await category.save()
        if (req.body.images){
            const cover = JSON.parse(req.body.images)
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            await image.save()
        }
        req.category = category
        next()
    } catch {
        res.cookie('error','err-2204')
        res.redirect('./show')
    }
}

exports.updateCategoryReport = async(req, res) => {
    var category = req.category
    const report = new Report({
        title:'category updated',
        action:`id : ${category.id},title : ${category.title}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect('./show')
}

async function saveImage(image, coverEncoded, categoryId, main) {
    try {
        if (coverEncoded == null) return res.cookie('error','err-2602'),res.redirect('/c/new')
        const cover = JSON.parse(coverEncoded)
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            image.owner = categoryId
            image.main = main
            await image.save()
        } else {
            res.cookie('error','err-2603')
            res.redirect('/c/new')
        }
    } catch{
        res.cookie('error','err-2600')
        res.redirect('/c/new')
    }
}