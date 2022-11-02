const express = require('./express');
const app = express();

//1.每一个路由都是一个layer层（由path跟dispatch组成）
//2.dispatch中的每个layer都有一个route，这个route中存放着真实的回调（这个layer区别于外层的layer，这个layer没有存放path路径）layer中会有get、post、delete等方法
//3.请求发生时，最先匹配路径。然后执行对应的dispatch方法。内部会迭代route里的方法


app.get('/', function (req, res, next) {

    console.log(1)
    next()
},
    function (req, res, next) {
        console.log(11)
        next()
    },
    function (req, res, next) {

        console.log(111)
        next()
    }) 

app.get('/', function (req, res) {
    console.log(2)
    next()
})


app.listen(3000, function () {
    console.log('server start')
})