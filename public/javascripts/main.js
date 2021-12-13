var app = document.getElementById('app')
const setSize = (width,height) => {
    app.style.width = `${width}px`
    app.style.height = `${height}px`
}
setSize(window.innerWidth,window.innerHeight)
window.onresize = ()=> {
    setSize(window.innerWidth,window.innerHeight)
}
function userMenu() {
    if (document.getElementsByClassName('userMenu')[0].classList.contains('off')){
        turn('off','on','userMenu',250,150,'grid','shadeScreen','shadeScreenFade')
    }else if (document.getElementsByClassName('userMenu')[0].classList.contains('on')) {
        turn('on','off','userMenu',0,200,'none','shadeScreenFade','shadeScreen')
    }
}
function loginMenu() {
    if (document.getElementsByClassName('loginMenu')[0].classList.contains('off')){
        turn('off','on','loginMenu',250,150,'grid','shadeScreen','shadeScreenFade')
    }else if (document.getElementsByClassName('loginMenu')[0].classList.contains('on')) {
        turn('on','off','loginMenu',0,200,'none','shadeScreenFade','shadeScreen')
    }
}
if (document.getElementsByClassName('userMenu')[0]) document.getElementsByClassName('screen')[0].addEventListener('click',()=>{turn('on','off','userMenu',0,300,'none','shadeScreenFade','shadeScreen')})
if (document.getElementsByClassName('loginMenu')[0]) document.getElementsByClassName('screen')[0].addEventListener('click',()=>{turn('on','off','loginMenu',0,300,'none','shadeScreenFade','shadeScreen')});

const turn = (from,to,target,width,duration,display,screenFrom,screenTo)=>{
    if (display === 'grid'){
        document.getElementsByClassName(`${target}`)[0].style.display = `${display}`
        document.getElementsByClassName(`screen`)[0].style.display = `${display}`
    }else {
        setTimeout(()=>{
            document.getElementsByClassName(`${target}`)[0].style.display = `${display}`
            document.getElementsByClassName(`screen`)[0].style.display = `${display}`
        },400)
    }
    document.getElementsByClassName('menu-form')[0].animate([{width: `${width}px`}],{duration:300,easing:"linear",fill:'forwards'})
    setTimeout(()=>{
        document.getElementsByClassName('inner-menu')[0].style.display = `${display}`
    },duration)
    document.getElementsByClassName(`${target}`)[0].classList.replace(`${from}`,`${to}`)
    document.getElementsByClassName('screen')[0].classList.replace(`${from}`,`${to}`)
    document.getElementsByClassName('screen')[0].classList.replace(`${screenFrom}`,`${screenTo}`)
}
if (document.getElementById('userReports')){
    document.getElementById('userReports').addEventListener('click',()=>{
        document.querySelectorAll('.auth-report').forEach(report=>{report.style.display='grid'})
        document.querySelectorAll('.product-report').forEach(report=>{report.style.display='none'})
        document.querySelectorAll('.admin-report').forEach(report=>{report.style.display='none'})
    })
}
if (document.getElementById('userReports')){
    document.getElementById('productsReports').addEventListener('click',()=>{
        document.querySelectorAll('.auth-report').forEach(report=>{report.style.display='none'})
        document.querySelectorAll('.product-report').forEach(report=>{report.style.display='grid'})
        document.querySelectorAll('.admin-report').forEach(report=>{report.style.display='none'})
    })
}
if (document.getElementById('userReports')){
    document.getElementById('adminReports').addEventListener('click',()=>{
        document.querySelectorAll('.auth-report').forEach(report=>{report.style.display='none'})
        document.querySelectorAll('.product-report').forEach(report=>{report.style.display='none'})
        document.querySelectorAll('.admin-report').forEach(report=>{report.style.display='grid'})
    })
}
if (document.getElementById('selectbtn')){
    document.getElementById('selectbtn').addEventListener('change',()=>{
        var e = document.getElementById('selectbtn')
        var value = e.options[e.selectedIndex].text
        setCookie('lang', `${value}`, 36500,refresh)
    })
}
function setCookie(cname, cvalue, exdays,done) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    done()
}
function refresh() {
    window.location.reload()
}