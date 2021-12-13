// modules and enviroment variables.

if (process.env.NODE_ENV !== 'production') {
    console.log('env-variables')
    require('dotenv').config()
}

//npm modules

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const partials = require('./middleware/getPartials')
const app = express()

// server routes.

const adminRoute = require('./routes/adminRo')
const authRoute = require('./routes/authRo')
const brandRoute = require('./routes/brandRo')
const categoryRoute = require('./routes/categoryRo')
const homeRoute = require('./routes/homeRo')
const productRoute = require('./routes/productRo')
const userRoute = require('./routes/userRo')

// server uses and sets and database.

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// launch server and set ends.

app.use(partials.selectLang,partials.username,partials.isAdmin,partials.message,partials.error)

app.use('/a', adminRoute)
app.use('/o', authRoute)
app.use('/b', brandRoute)
app.use('/c', categoryRoute)
app.use('/', homeRoute)
app.get('/about', (req,res)=>{res.render('about')})
app.use('/p', productRoute)
app.use('/u', userRoute)

app.listen(process.env.PORT || 3000)

