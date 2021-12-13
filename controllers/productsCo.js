// all modules.

const Product = require('../models/product')
const Category = require('../models/category')
const Brand = require('../models/brand')
const Image = require('../models/image')
const Report = require('../models/report')
const User = require('../models/user')
const CartItem = require('../models/cartItem')
const Cart = require('../models/cart')
const imageMimeTypes = ['image/jpeg', 'image/png']

// controllers.

exports.getProduct = async (req,res) => {
        try {
            const product = await Product.findById(req.params.id).exec()
            const images = await Image.find({owner: product.id}).exec()
            const brand = await Brand.findById(product.brand).exec()
            const category = await Category.findById(product.category).exec()
            const params = {}
            if (product == null || product == undefined) return res.cookie('error','err-3102'),res.redirect('/')
            params.product = product
            params.images = images
            params.brand = brand
            params.category = category
            res.render('products/show', params)
        } catch {
            res.cookie('error','err-3101')
            res.redirect('/')
        }
}

exports.getNewProduct = async(req, res) => {
    const categories = await Category.find({}).exec()
    const brands = await Brand.find({}).exec()
    res.render('products/new',{categories:categories,brands:brands})
}

exports.getProductManage = async (req,res) => {
    if (req.cookies.username && req.cookies.refreshToken){
        try {
            const username = req.cookies.username
            const token = req.cookies.refreshToken
            const product = await Product.findById(req.params.id).exec()
            const images = await Image.find({owner: req.params.id}).exec()
            const brand = await Brand.find({}).exec()
            const category = await Category.find({}).exec()
            const params = {}
            if (username != null && username != undefined) {
                const user = await User.find({ username: username, token: token}).exec()
                params.checkAdmin = user[0].isAdmin
            } else params.checkAdmin = undefined
            if (product == null || product == undefined) return res.cookie('error','err-3102'),res.redirect('./show')
            params.product = product
            params.images = images
            params.brands = brand
            params.categories = category
            res.render('products/manage', params)
        } catch {
            res.cookie('error','err-3103')
            res.redirect('./show')
        }
    } else {
        res.cookie('error','err-3404')
        res.redirect('/')
    }
}

exports.orderProduct = async (req, res) => {
    try {
        const user = await User.find({username: req.cookies.username, token: req.cookies.refreshToken}).exec()
        var cart = await Cart.find({owner: user[0].id}).exec()
        if (cart.length == 0) {
            cart = await new Cart({owner: user[0].id,itemsCount: 0}).save()
            await new CartItem({
                product: req.params.id,
                count: req.body.amount,
                cart: cart.id
            }).save()
            cart.itemsCount+1
            await cart.save()
            res.cookie('message',`msg-2000`)
            res.redirect(`./show`)
        } else {
            await new CartItem({
                product: req.params.id,
                count: req.body.amount,
                cart: cart[0].id
            }).save()
            cart[0].itemsCount+1
            await cart[0].save()
            res.cookie('message',`msg-2000`)
            res.redirect(`./show`)
        }
    } catch {
        res.cookie('error','err-2000')
        res.redirect('/')
    }
}

exports.postNewProductCreateProduct = async (req, res,next) => {
    const category = await Category.findById(req.body.category).exec()
    const brand = await Brand.findById(req.body.brand).exec()
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        nId: req.body.nId,
        inId: req.body.inId,
        category: category.id,
        brand: brand.id
    })
    const newProduct = await product.save()
    req.newProduct = newProduct
    next()
}
exports.postNewProductSaveImages = async (req, res,next) => {
    try {
        var newProduct = req.newProduct
        if (typeof req.body.images === 'object'){
            let images = req.body.images
            images = images.reverse()
            var checkMain = false,i = 0
            images.forEach(async function(imageCode) {
                i++
                try {
                    if (i == 1) checkMain = true
                    else checkMain = false
                    saveImage(new Image(),imageCode,newProduct.id,checkMain)
                } catch{
                    res.cookie('error','err-2600')
                    res.redirect('/p/new')
                }
            })
        } else {
            let imageCode = req.body.images
            saveImage(new Image(),imageCode,newProduct.id,true)
        }
        next()
    } catch {
        res.cookie('error','err-2601')
        res.redirect('/p/new')
    }
}
exports.postNewProductReport = async (req, res) => {
    var newProduct = req.newProduct
    const report = new Report({
        title:'product added',
        action:`id : ${newProduct.nId},reason : ${req.body.reason}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect(`./${newProduct.id}/show`)
}
exports.updateProductComplete = async(req, res,next) => {
    try {
        const product = await Product.findById(req.params.id).exec()
        const image = await Image.findOne({owner: product.id}).exec()
        if (req.body.title) {product.title = req.body.title} else {product.title = product.title}
        if (req.body.description) {product.description = req.body.description} else {product.description = product.description}
        if (req.body.nId) {product.nId = req.body.nId} else {product.nId = product.nId}
        if (req.body.inId) {product.inId = req.body.inId} else {product.inId = product.inId}
        if (req.body.category) {product.category = req.body.category} else {product.category = product.category}
        if (req.body.brand) {product.brand = req.body.brand} else {product.brand = product.brand}
        await product.save()
        if (req.body.images){
            const cover = JSON.parse(req.body.images)
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            await image.save()
        }
        req.product = product
        next()
    } catch {
        res.cookie('error','err-2006')
        res.redirect('./show')
    }
}
exports.updateProductReport = async(req, res) => {
    var product = req.product
    const report = new Report({
        title:'product updated',
        action:`id : ${product.nId}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'productReport'
    })
    await report.save()
    res.redirect('./show')
}

exports.removeProduct = async (req, res,next) => {
    try {
        const product = await  Product.findById(req.path.split('/')[1]).exec()
        const image = await Image.findOne({owner: product.id}).exec()
        const cartItems = await CartItem.find({product: product.id}).exec()
        if (image != null)await image.remove()
        if (cartItems != 0) cartItems.forEach(async item=>{await item.remove()})
        await product.remove()
        next()
    } catch {
        res.cookie('error','err-2007')
        res.redirect('./show')
    }
}
exports.removeProductReport = async (req, res) => {
    const report = await new Report({
        title: 'apartment removed',
        action: `reason : ${req.body.reason}`,
        reportedBy: `${req.cookies.username}`,
        reportType: 'manageReport'
    })
    await report.save()
    res.redirect(`/p/new`)
}
async function saveImage(image, coverEncoded, productId, main) {
    try {
        if (coverEncoded == null) {return res.cookie('error','err-2602'),res.redirect('/p/new')}
        const cover = JSON.parse(coverEncoded)
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            image.owner = productId
            image.main = main
            await image.save()
        } else {
            res.cookie('error','err-2603')
            res.redirect('/p/new')
        }
    } catch {
        res.cookie('error','err-2600')
        res.redirect('/p/new')
    }
}