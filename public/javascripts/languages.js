import {en} from '../languages/en.js'
import {ar} from '../languages/ar.js'
var lang

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
switch (getCookie('lang')){
  case 'العربية': lang = ar
  break
  case 'English': lang = en
  break
  default: lang = en
  break
}

if (document.getElementsByClassName('show-message')[0]) document.getElementsByClassName('show-message')[0].classList.forEach(c=>{if (c.indexOf('msg-') > -1) document.getElementsByClassName('show-message')[0].innerText = lang.messages[`m${c.split('-')[1]}`]})
if (document.getElementsByClassName('error-message')[0]) document.getElementsByClassName('error-message')[0].classList.forEach(c=>{if (c.indexOf('err-') > -1) document.getElementsByClassName('error-message')[0].innerText = lang.errors[`e${c.split('-')[1]}`]})

if(document.getElementById('searchBar')) document.getElementById('searchBar').placeholder = lang.header.searchBar
if(document.getElementById('categories')) document.getElementById('categories').innerText = lang.header.categories
if(document.getElementById('brands')) document.getElementById('brands').innerText = lang.header.brands
if(document.getElementById('aboutUs')) document.getElementById('aboutUs').innerText = lang.header.aboutUs

if(document.getElementById('copyrights')) document.getElementById('copyrights').innerHTML = `<h2>${lang.footer.copyrights}</h2>`
if(document.getElementById('powerdBy')) document.getElementById('powerdBy').innerHTML = `<h2>${lang.footer.powerdBy}</h2>`
if(document.getElementById('number1')) document.getElementById('number1').innerText = lang.footer.number1
if(document.getElementById('number2')) document.getElementById('number2').innerText = lang.footer.number2
if(document.getElementById('number3')) document.getElementById('number3').innerText = lang.footer.number3
if(document.getElementById('number4')) document.getElementById('number4').innerText = lang.footer.number4
if(document.getElementById('number5')) document.getElementById('number5').innerText = lang.footer.number5
if(document.getElementById('number6')) document.getElementById('number6').innerText = lang.footer.number6

if(document.getElementById('menuLoginBtn')) document.getElementById('menuLoginBtn').innerText = lang.authMenu.loginMenu.login
if(document.getElementById('menuSignupBtn')) document.getElementById('menuSignupBtn').innerText = lang.authMenu.loginMenu.signup
if(document.getElementById('menuLogoutBtn')) document.getElementById('menuLogoutBtn').innerText = lang.authMenu.userMenu.logout
if(document.getElementById('menuInbox')) document.getElementById('menuInbox').innerText = lang.authMenu.userMenu.inbox
if(document.getElementById('menuCart')) document.getElementById('menuCart').innerText = lang.authMenu.userMenu.cart
if(document.getElementById('adminPanel')) document.getElementById('adminPanel').innerText = lang.authMenu.userMenu.adminPanel
if(document.getElementById('admin')) document.getElementById('admin').innerText = lang.authMenu.userMenu.admin
if(document.getElementById('select')) document.getElementById('select').innerText = lang.authMenu.userMenu.select
if(document.getElementById('arabic')) document.getElementById('arabic').innerText = lang.authMenu.userMenu.arabic
if(document.getElementById('english')) document.getElementById('english').innerText = lang.authMenu.userMenu.english

if(document.getElementById('newProducts')) document.getElementById('newProducts').innerText = lang.home.newProducts
if(document.getElementById('srcResult')) document.getElementById('srcResult').innerText = lang.home.srcResult

if(document.getElementById('leadership1')) document.getElementById('leadership1').innerText = lang.about.leadership1
if(document.getElementById('leadership2')) document.getElementById('leadership2').innerText = lang.about.leadership2
if(document.getElementById('leadership3')) document.getElementById('leadership3').innerText = lang.about.leadership3
if(document.getElementById('leadership1Job')) document.getElementById('leadership1Job').innerText = lang.about.leadership1Job
if(document.getElementById('leadership2Job')) document.getElementById('leadership2Job').innerText = lang.about.leadership2Job
if(document.getElementById('leadership3Job')) document.getElementById('leadership3Job').innerText = lang.about.leadership3Job
if(document.getElementById('leadershipTag')) document.getElementById('leadershipTag').innerText = lang.about.leadershipTag
if(document.getElementById('productsTag')) document.getElementById('productsTag').innerText = lang.about.productsTag
if(document.getElementById('descriptionTag')) document.getElementById('descriptionTag').innerText = lang.about.descriptionTag
if(document.getElementById('description')) document.getElementById('description').innerText = lang.about.description
if(document.getElementById('descriptionTag')) document.getElementById('descriptionTag').innerText = lang.about.descriptionTag
if(document.getElementById('description')) document.getElementById('description').innerText = lang.about.description
if(document.getElementById('locationTag')) document.getElementById('locationTag').innerText = lang.about.locationTag
if(document.getElementById('location')) document.getElementById('location').innerText = lang.about.location

if(document.getElementById('reports')) document.getElementById('reports').innerText = lang.adminPanel.reports
if(document.getElementById('userReports')) document.getElementById('userReports').innerText = lang.adminPanel.userReports
if(document.getElementById('productsReports')) document.getElementById('productsReports').innerText = lang.adminPanel.productReports
if(document.getElementById('adminReports')) document.getElementById('adminReports').innerText = lang.adminPanel.adminReports
if(document.getElementById('manageUsers')) document.getElementById('manageUsers').innerText = lang.adminPanel.manageUsers
if(document.getElementById('orders')) document.getElementById('orders').innerText = lang.adminPanel.orders
if(document.getElementById('product')) document.getElementById('product').innerText = lang.adminPanel.product
if(document.getElementById('productHere')) document.getElementById('productHere').innerText = lang.adminPanel.productHere
if(document.getElementById('category')) document.getElementById('category').innerText = lang.adminPanel.category
if(document.getElementById('brand')) document.getElementById('brand').innerText = lang.adminPanel.brand

if(document.getElementById('email')) document.getElementById('email').placeholder = lang.auth.email
if(document.getElementById('password')) document.getElementById('password').placeholder = lang.auth.password
if(document.getElementById('confirmPassword')) document.getElementById('confirmPassword').placeholder = lang.auth.confirmPassword
if(document.getElementById('username')) document.getElementById('username').placeholder = lang.auth.username
if(document.getElementById('loginBtn')) document.getElementById('loginBtn').innerText = lang.auth.login
if(document.getElementById('signupBtn')) document.getElementById('signupBtn').innerText = lang.auth.signup
if(document.getElementById('loginNote')) document.getElementById('loginNote').innerHTML = lang.auth.inNote + '<a id="signupLink" href="./signup"></a>'
if(document.getElementById('signupNote')) document.getElementById('signupNote').innerHTML = lang.auth.upNote + '<a id="loginLink" href="./login"></a>'
if(document.getElementById('signupLink')) document.getElementById('signupLink').innerText = lang.auth.signup
if(document.getElementById('loginLink')) document.getElementById('loginLink').innerText = lang.auth.login

if (document.getElementById('addToCart')) document.getElementById('addToCart').innerHTML = lang.product.addToCart
if (document.getElementById('productManage')) document.getElementById('productManage').innerHTML = lang.product.manage
if (document.getElementById('productCreate')) document.getElementById('productCreate').innerHTML = lang.product.create
if (document.getElementById('productUpdate')) document.getElementById('productUpdate').innerHTML = lang.product.update
if (document.getElementById('productRemove')) document.getElementById('productRemove').innerHTML = lang.product.remove
if (document.getElementById('selectCategory')) document.getElementById('selectCategory').innerHTML = lang.product.selectCategory
if (document.getElementById('selectBrand')) document.getElementById('selectBrand').innerHTML = lang.product.selectBrand

if (document.getElementById('allCategories')) document.getElementById('allCategories').innerHTML = lang.category.categories
if (document.getElementById('categoryManage')) document.getElementById('categoryManage').innerHTML = lang.category.manage
if (document.getElementById('categoryCreate')) document.getElementById('categoryCreate').innerHTML = lang.category.create
if (document.getElementById('categoryUpdate')) document.getElementById('categoryUpdate').innerHTML = lang.category.update

if (document.getElementById('allBrands')) document.getElementById('allBrands').innerHTML = lang.brand.brands
if (document.getElementById('brandManage')) document.getElementById('brandManage').innerHTML = lang.brand.manage
if (document.getElementById('brandCreate')) document.getElementById('brandCreate').innerHTML = lang.brand.create
if (document.getElementById('brandUpdate')) document.getElementById('brandUpdate').innerHTML = lang.brand.update

if(document.getElementById('userReply')) document.getElementById('userReply').innerHTML = lang.user.reply
if(document.getElementById('userSend')) document.getElementById('userSend').innerHTML = lang.user.send
if(document.getElementById('userTotal')) document.getElementById('userTotal').innerHTML = lang.user.total + document.getElementById('userTotal').innerHTML
if(document.getElementById('orderNow')) document.getElementById('orderNow').innerHTML = lang.user.orderNow
if(document.getElementById('orderWhatsapp')) document.getElementById('orderWhatsapp').innerHTML = lang.user.orderWhatsapp + document.getElementById('orderWhatsapp').innerHTML
if(document.getElementById('typeMessage')) document.getElementById('typeMessage').placeholder = lang.user.typeMessage