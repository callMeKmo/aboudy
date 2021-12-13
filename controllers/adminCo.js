// all modules.

const User = require('../models/user')
const Report = require('../models/report')

// controllers.

exports.getAdminPanel = (req,res) => {
    res.render('admin/adminPanel')
}

exports.getAdminManage = async (req,res) => {
    try {
        const users = await User.find({isAdmin: false}).exec()
        res.render('admin/manageUsers',{users: users})
    } catch {
        res.cookie('error','err-3000')
        res.redirect('/a/aadminpanel')
    }
}

exports.getAdminOrders = async (req,res) => {
    try {
        var orders = await Report.find({reportType: 'orderReport'}).exec()
        orders = orders.reverse()
        res.render('admin/orders',{orders: orders})
    } catch {
        res.cookie('error','err-3001')
        res.redirect('/a/aadminpanel')
    }
}

exports.getAdminReports = async (req,res) => {
    var authReports = await Report.find({reportType: 'authReport'}).exec()
    var productReports = await Report.find({reportType: 'productReport'}).exec()
    var adminReports = await Report.find({reportType: 'adminReport'}).exec()
    try {
        authReports = authReports.reverse()
        productReports = productReports.reverse()
        adminReports = adminReports.reverse()
        res.render('admin/reports',{
            authReports: authReports,
            productReports: productReports,
            adminReports: adminReports
        })
    } catch {
        res.cookie('error','err-3002')
        res.redirect('/a/adminpanel')
    }
}
exports.getReport = async (req,res) =>{
    const report = await Report.findById(`${req.params.id}`).exec()
    try {
        if (report.reportType === 'orderReport') {
            var params = {
                report: report,
                username:''
            }
            var user = await User.findById(`${report.reportedBy}`).exec()
            params.username = user.username
        }
        res.render('admin/show',params)
    } catch {
        res.cookie('error','err-3003')
        res.redirect('/a/adminpanel')
    }
}

exports.deleteUser = async (req,res) => {
    const user = await User.find({id: req.body.userId}).exec()
    if (user.length != 0){
        const report = await new Report({
            title: 'user removed',
            action: `user ${user.email} have been removed`,
            reportedBy: `${req.cookies.username}`,
            reportType: 'authReport'
        })
        report.save()
        user.remove()
        res.redirect('/a/adminPanel')
    } else {
        res.cookie('error','err-3400')
        res.redirect('/a/adminpanel')
    }
}