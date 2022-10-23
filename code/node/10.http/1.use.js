const http = require('http')
const url = require('url')

let server = http.createServer(function (req, res) {
    // console.log(req.method) //请求方法默认是大写的
    // console.log(req.url) //备注：此处是拿不到URL地址中的hash的，因为hash是前端浏览器做路由的。不会传递给服务器
    // console.log(req.httpVersion)
    // console.log(req.headers)//所有的请求头信息，里面的可以都是小写的（服务器接收到的）。但是浏览器中network中的request header则是大写的
    let { pathname, query } = url.parse(req.url, true);
    console.log(pathname, query)// / [Object: null prototype] { a: '1111', b: '2222' }
    //req是一个可读流
    let arr = []
    // curl -v -X POST a=1 localhost:3000
    //如果流中的数据为空，内部会调用的push(null)，只要一调用了push方法就会触发end事件，例如使用curl -v -X GET localhost:3000
    req.on('data', function (chunk) {
        arr.push(chunk)
    })
    req.on('end',function(){
        console.log(Buffer.concat(arr).toString())//a=1
    })
    res.statusCode = 600 //自定义响应码
    res.statusMessage = "no status"//这个不可写中文
    res.setHeader('a',1)//设置响应头
    res.write('ok') //分段响应，如果是分段响应的，则请求中会有一个Transfer-Encoding：chunkeds 的标志，反之则没有
    res.end()//标识响应结束
})
// server start 3000'
// GET       
// /
// 1.1

// server.on('request', function (req, res) {
//     console.log('2')
// })
let port = 3000; //端口尽量使用3000以上的
server.listen(port, function () {
    console.log(`server start ${port}'`)
})
//如果端口被占用则监听报错事件重新设置端口
server.on('error', function (err) {
    if (err.errno == 'EADDRINUSE') {
        server.listen(++port)
    }
})