// all modules.

const Brand = require('../models/brand')
const Image = require('../models/image')
const Report = require('../models/report')
const User = require('../models/user')
const Product = require('../models/product')
const imageMimeTypes = ['image/jpeg', 'image/png']

// controllers.

exports.getBrand = async (req,res) => {
    try {
        const username = req.cookies.username
        const token = req.cookies.refreshToken
        const brand = await Brand.findById(req.params.id).exec()
        const images = await Image.find({owner: req.params.id}).exec()
        var catProducts = []
        const params = {}
        const products = await Product.find({brand: req.params.id}).exec()
        if (products.length != 0){
            products.forEach(async function(production) {
                try {
                    let cover = await Image.find({owner: production.id}).exec()
                    catProducts[catProducts.length] = [production,cover[0]]
                    if (catProducts.length == products.length){
                        params.products = catProducts
                        if (username != null && username != undefined) {
                            const user = await User.find({ username: username, token: token}).exec()
                            params.checkAdmin = user[0].isAdmin
                        } else params.checkAdmin = undefined
                        if (brand == null || brand == undefined) {
                            res.cookie('error','err-3301')
                            res.redirect('/b/all')
                        }
                        params.brand = brand
                        params.images = images
                        res.render('brands/show', params)
                    }
                } catch {
                    res.cookie('error','err-3302')
                    res.redirect('/b/all')
                }
            })
        } else {
            if (username != null && username != undefined) {
                const user = await User.find({ username: username, token: token}).exec()
                params.checkAdmin = user[0].isAdmin
            } else params.checkAdmin = undefined
            if (brand == null || brand == undefined) {
                res.cookie('error','err-3301')
                res.redirect('/b/all')
            }
            params.brand = brand
            params.images = images
            params.products = catProducts
            res.render('brands/show', params)
        }
    } catch {
        res.cookie('error','err-3302')
        res.redirect('/b/all')
    }
}

exports.getBrandManage = async (req,res) => {
    if (req.cookies.username && req.cookies.refreshToken){
        try {
            const username = req.cookies.username
            const token = req.cookies.refreshToken
            const brand = await Brand.findById(req.params.id).exec()
            const images = await Image.find({owner: req.params.id}).exec()
            const params = {}
            if (username != null && username != undefined) {
                const user = await User.find({ username: username, token: token}).exec()
                params.checkAdmin = user[0].isAdmin
            } else params.checkAdmin = undefined
            if (brand == null || brand == undefined) {
                res.cookie('error','err-3301')
                res.redirect('./show')
            }
            params.brand = brand
            params.images = images
            res.render('brands/manage', params)
        } catch {
            res.cookie('error','err-3303')
            res.redirect('./show')
        }
    } else {
        res.cookie('error','err-3404')
        res.redirect('/')
    }
}

exports.getNewBrand = async(req, res) => {
    res.render('brands/new')
}

exports.getAllBrands = async(req,res) => {
    const rawBrands = await Brand.find().sort({ createdAt: 'desc' }).exec()
    var brands = []
    if (rawBrands.length == 0) {
        const params = {brands:brands}
        res.render('brands/allBrands',params)
    }
    rawBrands.forEach(async brand=>{
        const image = await Image.find({owner: brand.id}).exec()
        brands[brands.length] = {brand: brand,image: image[0]}
        if (rawBrands.length == brands.length){
            const params = {brands:brands}
            res.render('brands/allBrands',params)
        }
    })
}

exports.postNewBrandCreateBrand = async (req, res,next) => {
    if (req.body.title == null || req.body.title === '') {
        res.cookie('error','err-2202')
        res.redirect('/b/new')
    }
    if (req.body.description == null || req.body.description === '') {
        res.cookie('error','err-2203')
        res.redirect('/b/new')
    }
    const brand = new Brand({
        title: req.body.title,
        description: req.body.description,
    })
    const newBrand = await brand.save()
    req.newBrand = newBrand
    next()
}

exports.postNewBrandSaveImages = async (req, res,next) => {
    try {
        var newBrand = req.newBrand
        if (typeof req.body.images === 'object'){
            let images = req.body.images
            images = images.reverse()
            var checkMain = false,i = 0
            images.forEach(async function(imageCode) {
                i++
                try {
                    if (i == 1) checkMain = true
                    else checkMain = false
                    saveImage(new Image(),imageCode,newBrand.id,checkMain)
                } catch{
                    res.cookie('error','err-2600')
                    res.redirect('/b/new')
                }
            })
        } else {
            let imageCode = req.body.images
            saveImage(new Image(),imageCode,newBrand.id,true)
        }
        next()
    } catch {
        res.cookie('error','err-2601')
        res.redirect('/b/new')
    }
}
exports.postNewBrandReport = async (req, res) => {
    var newBrand = req.newBrand
    const report = new Report({
        title:'brand added',
        action:`id : ${newBrand.id},reason : ${req.body.reason}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect(`./${newBrand.id}/show`)
}
exports.updateBrandCheckEmpty = (req, res, next) => {
    if ( req.body.title == null || req.body.title === '') return res.cookie('error','err-2202'),res.redirect('./show')
    if ( req.body.description == null || req.body.description === '') return res.cookie('error','err-2203'),res.redirect('./show')
    next()
}
exports.updateBrandComplete = async(req, res,next) => {
    try {
        const brand = await Brand.findById(req.params.id).exec()
        const image = await Image.findOne({owner: brand.id}).exec()
        brand.title = req.body.title
        brand.description = req.body.description
        await brand.save()
        if (req.body.images){
            const cover = JSON.parse(req.body.images)
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            await image.save()
        }
        req.brand = brand
        next()
    } catch {
        res.cookie('error','err-2204')
        res.redirect('./show')
    }
}

exports.updateBrandReport = async(req, res) => {
    var brand = req.brand
    const report = new Report({
        title:'brand updated',
        action:`id : ${brand.id},title : ${brand.title}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect('./show')
}

async function saveImage(image, coverEncoded, brandId, main) {
    try {
        if (coverEncoded == null) return res.cookie('error','err-2602'),res.redirect('/b/new')
        const cover = JSON.parse(coverEncoded)
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            image.owner = brandId
            image.main = main
            await image.save()
        } else {
            res.cookie('error','err-2603')
            res.redirect('/b/new')
        }
    } catch{
        res.cookie('error','err-2600')
        res.redirect('/b/new')
    }
}