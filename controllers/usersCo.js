// all modules.

const User = require('../models/user')
const Report = require('../models/report')
const Message = require('../models/message')
const CartItem = require('../models/cartItem')
const Cart = require('../models/cart')
const Product = require('../models/product')

// controllers.

exports.message = async (req,res) => {
    if (req.query.userId){
        const user = await User.findById(`${req.query.userId}`)
        try{
            res.render('users/message',{to:user,from:req.cookies.username})
        } catch {
            res.cookie('error','err-3401')
            res.redirect('/')
        }
    } else {
        res.cookie('error','err-3404')
        res.redirect('/')
    }
}

exports.postOrder = async (req,res) => {
    const user = await User.findOne({token: `${req.cookies.refreshToken}`}).exec()
    const cart = await Cart.findById(req.path.split('/')[1]).exec()
    try{
        const cartItems = await CartItem.find({cart:cart.id}).exec()
        if (cartItems.length != 0){
            var products = []
            cartItems.forEach(async item=>{
                const product = await Product.findOne({_id: item.product}).exec()
                products[products.length] = {nId:product.nId,count:item.count,id:item.id}
                await item.remove()
                if (products.length == cartItems.length) {
                    var orderDetails = ''
                    products.forEach(e=>{
                        if (orderDetails === '') orderDetails = `${e.count} piece(s) of product: ${e.nId}`
                        else orderDetails = orderDetails + `, ${e.count} piece(s) of product: ${e.nId}`
                    })
                    await new Report({
                        title:'products ordered',
                        action:`order details: ${orderDetails}`,
                        reportedBy: `ordered by: ${user.id}`,
                        reportType: 'orderReport'
                    }).save()
                    await cart.remove()
                    res.cookie('message',`msg-2401`)
                    res.redirect('/')
                }})
            }
    } catch {
        res.cookie('error','err-2402')
        res.redirect('/u/cart')
    }
}

exports.getCart = async (req,res) => {
    const user = await User.findOne({token: `${req.cookies.refreshToken}`}).exec()
    var cart = await Cart.find({owner: user.id}).exec()
    if (cart.length == 0) {cart = await new Cart({owner: user.id,itemsCount: 0}).save();var cartItems = await CartItem.find({cart:cart.id}).exec()}
    else {var cartItems = await CartItem.find({cart:cart[0].id}).exec()}
    try{
        var products = []
        if (cartItems.length != 0){
            cartItems.forEach(async item=>{
                const product = await Product.findOne({_id: item.product}).exec()
                products[products.length] = {title:product.title,count:item.count,id:item.id}
                if (products.length == cartItems.length) {res.render('users/cart',{count: products.length,products: products,id:cart[0].id})}
            }) 
        } else {
            res.render('users/cart',{count: cart.itemsCount,products: products})
        }
    } catch {
        res.cookie('error','err-3402')
        res.redirect('/')
    }
}

exports.showMessage = async (req,res) => {
    const message = await Message.findById(`${req.params.id}`)
    res.render('users/show',{showMessage:message})
}

exports.getUserInbox = async (req,res) => {
    const user = await User.findOne({token: `${req.cookies.refreshToken}`}).exec()
    const messages = await Message.find({recieverId : `${user.id}`}).exec()
    messages.reverse()
    res.render('users/inbox',{messages : messages})
}

exports.postMessage = async(req,res) => {
    const user = await User.findOne({token: `${req.cookies.refreshToken}`}).exec()
    if (user.id == req.query.userId) {
        res.cookie('error','err-2300')
        res.redirect('/')
    }
    const message = new Message({
        content: req.body.content,
        senderId: user.id,
        sender: user.username,
        recieverId: req.query.userId
    })
    await message.save()
    res.redirect('/')
}

exports.deleteCartItem = async(req,res) => {
    try {
        const cartItem = await CartItem.findById(req.path.split('/')[2]).exec()
        await cartItem.remove()
        res.cookie('message','msg-2400')
        res.redirect('/u/cart')
    } catch {
        res.cookie('error','err-2400')
        res.redirect('/u/cart')
    }
}

exports.deleteUser = async(req,res,next) => {
    if (req.cookies.username && req.cookies.refreshToken) {
        const username = req.cookies.username
        const token = req.cookies.refreshToken
        try {
            const user = await User.find({username: username, token: token}).exec()
            await user[0].remove()
            req.email = user[0].email
            next()
        } catch {
            res.cookie('error','err-2500')
            res.redirect('/a/adminPanel')
        }
    }
}

exports.deleteUserReport = async(req,res) => {
    try {
        const report = new Report({
            title:'user removed',
            action:`removed user email : ${req.email}`,
            reportedBy: 'system',
            reportType: 'authReport'
        })
        await report.save()
        res.redirect('/a/adminpanel')
    } catch {
        res.cookie('error','err-2500')
        res.redirect('/a/adminPanel')
    }
}