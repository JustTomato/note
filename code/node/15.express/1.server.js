const express = require('./express'); //const koa = require('koa)

const app = express(); //cosnt app = new Koa();
//由于express实现的比较早，但是没有class类的概念而是采用了构造函数的写法，是函数执行的写法



//koa-router 也是借鉴了express中自带的路由编写的
app.get('/', function (req, res) {
    //参数中的回调函数中参数只有原生的req\res。没有像koa封装了ctx
    res.end('home')
}) //app.use();

app.get('/about', function (req, res) {
    res.end('about')
})
// app.all('*',function(req,res){
//     res.end('all')
// })

app.listen(3000,function(){
    console.log('server start')
})