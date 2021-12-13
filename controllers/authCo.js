// all modules.

const User = require('../models/user')
const Report = require('../models/report')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// get controllers

exports.getAuthLogIn = (req,res) => {
    res.render('auth/login')
}

exports.getAuthSignUp = (req,res) => {
    res.render('auth/signup')
}

exports.getAuthToken = (req,res) => {
    res.render('auth/token')
}

exports.getAuthLogOut = (req,res) => {
    res.render('auth/logout')
}

// post controllers

exports.postAuthLogInCheckEmpty = (req, res, next) => {
    if (req.body.email == null || req.body.email == '') return res.cookie('error','err-1000'),res.redirect('/o/login')
    if (req.body.password == null || req.body.passsword == '') return res.cookie('error','err-1001'),res.redirect('/o/login')
    next()
}
exports.postAuthLogInCheckData = async(req,res,next) => {
    const user = await User.find({email: req.body.email}).exec()
    if (typeof user === 'object' || typeof user === Array){
    if (user.length != 1) return res.cookie('error','err-1010'),res.redirect('/o/login')
    } else if (user[0] == null) return res.cookie('error','err-1010'),res.redirect('/o/login')
    if (req.body.email.indexOf('@') < 0 || req.body.email.split('@')[1].indexOf('.') < 0) return res.cookie('error','err-1011'),res.redirect('/o/login')
    if (req.body.password.length <= 7) return res.cookie('error','err-1012'),res.redirect('/o/login')
    req.user = user
    next()
}
exports.postAuthLogInCompleted = async (req,res,next) => {
    var user = req.user
    try {
        bcrypt.compare(req.body.password, user[0].password, async(err, result)=>{
            if (err) return res.cookie('error','err-1013'),res.redirect('/o/login')
            if (result) {
                const token = genreateAccessToken({username: user[0].username})
                const refreshToken = jwt.sign({username: user[0].username}, process.env.REFRESH_TOKEN_SECRET)
                user[0].token = refreshToken
                user[0].lastSeen = new Date()
                user[0].active = true
                user[0].save()
                res.cookie('token',`${token}`,{maxAge: 10*60*1000})
                res.cookie('refreshToken',`${refreshToken}`,{maxAge: 24*60*60*1000})
                res.cookie('username',`${user[0].username}`,{maxAge: 24*60*60*1000})
                res.redirect('/')
                req.user = user
                next()
            } else return res.cookie('error','err-1020'),res.redirect('/o/login')
        })
    } catch (err) {
        console.log(err);
        res.redirect('/')
    }
}

exports.postAuthLogInReport = async (req,res) => {
    var user = req.user
    try {
        if (user[0].isAdmin == true){
            const report = new Report({
                title:`admin login`,
                action:`admin name : ${user[0].username}`,
                reportedBy: 'system',
                reportType: 'adminReport'
            })
            await report.save()
        }
    } catch {
        res.cookie('error','err-1021')
        res.redirect('/o/logout')
    }
}

exports.postAuthToken = (req,res)=>{
    const refreshToken = req.cookies.refreshToken
    const link = req.cookies.reqlink
    if (refreshToken == null) return res.redirect('/o/login')
    if (link == null || link == undefined) return res.redirect('/')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) user[0].active = false
    const token = genreateAccessToken({ username : user})
    res.cookie('token',`${token}`,{maxAge: 10*60*1000})
    res.clearCookie('reqlink')
    res.redirect(`${link}`)
    })
}

exports.postAuthSignUpCheckEmpty = (req, res,next) => {
    if ( req.body.email == null || req.body.email === '') return res.cookie('error','err-1200'),res.redirect('/o/signup')
    if ( req.body.username == null || req.body.username === '') return res.cookie('error','err-1201'),res.redirect('/o/signup')
    if ( req.body.password == null || req.body.password === '') return res.cookie('error','err-1202'),res.redirect('/o/signup')
    if ( req.body.confirmPassword == null || req.body.confirmPassword === '') return res.cookie('error','err-1203'),res.redirect('/o/signup')
    if ( req.body.email.indexOf('@') < 0 || req.body.email.split('@')[1].indexOf('.') < 0) return res.cookie('error','err-1210'),res.redirect('/o/signup')
    if ( req.body.password.length < 7) return res.cookie('error','err-1211'),res.redirect('/o/signup')
    if ( req.body.password !== req.body.confirmPassword) return res.cookie('error','err-1212'),res.redirect('/o/signup')
    next()
}
exports.postAuthSignUpCheckExsit = async (req, res,next) => {
    try {
        const checkUsers = await User.find({email : req.body.email})
        if (checkUsers.length > 0) return res.cookie('error','err-1213'),res.redirect('/o/signup')
        req.encryptedPassword = await bcrypt.hash(req.body.password, 10)
        res.redirect('./login')
        next()
    } catch {
        res.cookie('error','err-1220')
        res.redirect('/o/signup')
    }
}
exports.postAuthSignUpCreateUser = async (req, res,next) => {
    try {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.encryptedPassword,
        })
        req.newUser = await user.save()
        next()
    } catch {
        res.cookie('error','err-1221')
        res.redirect('/o/signup')
    }
}
exports.postAuthSignUpReport = async (req, res) => {
    try{
        const report = new Report({
            title:'user signup',
            action:`user email : ${req.newUser.email}`,
            reportedBy: 'system',
            reportType: 'authReport'
        })
        const newReport = await report.save()
        req.newUser.report = newReport.id
    } catch {
        res.cookie('error','err-1222')
        res.redirect('/o/signup')
    }
}

// delete controllers.

exports.deleteAuthLogOut = async (req, res,next)=>{
    try {
        const user = await User.find({token: req.cookies.refreshToken}).exec()
        req.cookies.refreshToken
        if (user.length != 0){
            user[0].token = ``;
            user[0].active = false;
            user[0].save()
        }
        res.clearCookie('refreshToken')
        res.clearCookie('token')
        res.clearCookie('username')
        req.selectedUser = user[0]
        next()
    } catch {
        res.cookie('error','err-1100')
        res.redirect('/')
    }
}
exports.deleteAuthLogOutReport = async (req, res)=>{
    try {
        if (req.selectedUser.isAdmin == true){
            const report = new Report({
                title:`admin logout`,
                action:`admin name : ${req.selectedUser.username}`,
                reportedBy: 'system',
                reportType: 'adminReport'
            })
            await report.save()
        }
        res.redirect('/o/login')
    } catch {
        res.cookie('error','err-1110')
        res.redirect('/')
    }
}
// JWT token Genreator.

function genreateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
}