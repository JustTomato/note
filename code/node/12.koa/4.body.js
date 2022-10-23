//服务端有可能从客户端获取到用户提交的数据，服务端需要进行将诶收数据并响应（例如Ajax）
const Koa = require('koa');
const app = new Koa();
const bodyParse = require('./koa-bodparse');
const static = require('./koa-static');
const path = require('path')
//假设：
//1.当客户端访问/login且为get时，服务端需要返回一个登录页
//注释：表单提交没有跨域的问题，跨域是浏览器本身的问题;

app.use(bodyParse(path.resolve(__dirname,'upload'))) //所有的插件都是一个函数
app.use(static(path.resolve(__dirname,'koa')))
app.use(static(__dirname));


//2.当客户端访问/login且为post时，服务端需要做登录操作
app.use(async (ctx, next) => { 
    if (ctx.path === '/login' && ctx.method === 'POST') {
        ctx.set('Content-Type','text/html;charset=utf-8')
        ctx.body = ctx.request.body
    } else {
        next()
    }
})





app.listen(3000)