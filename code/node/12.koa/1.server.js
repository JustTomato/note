//1.
const Koa = require('./koa')
const fs = require('fs')
const path = require('path')

const app = new Koa(); //创建Koa应用

//2.Koa三个核心的API分别是lisen,use,on('error)
app.use(function(ctx){ 
//此处的function相当于Node中Http服务中handleRequest方法
//而handleRequest方法中是有req和res两个参数的。但是Koa直接提供了一个上下文的概念ctx，因为在Node中需要自己基于req和res参数处理自己所需要的数据（像处理Path处理URL）。所以Koa直接封装好了一个对象给我们使用
    //ctx是Koa中的上下文
    //此处接收到响应之后
    console.log(ctx.req.url)//原生的req对象
    console.log(ctx.request.req.url)//原生的req对象

    console.log(ctx.request.path) //koa自己封装的
    console.log(ctx.path)//koa自己封装的


    // ctx.body = "hello";
    // ctx.body = "world";
    // //ctx.body 并不是res.end('xxx')方法，因为ctx.body可以使用多次，且只取最后取一次。但是res.end()不能使用多次
    // console.log(ctx.response.body);

    // //或者可以这样使用
    // ctx.response.body = "hello";
    // ctx.response.body = "world";
    // console.log(ctx.body);

    //读取内容
    ctx.set('Content-Type','text/html')//设置响应头
    ctx.body= fs.createReadStream(path.resolve(__dirname,'a.html'))
   
})
//监听3000端口
app.listen(3000)


//use 为注册函数方法
//ctx Koa上下文，ctx是对原生的req和res进行了封装，封装成了一个新的参数 request和response【ctx上既有原生的req和res也有Koa自己封装的request和response】
