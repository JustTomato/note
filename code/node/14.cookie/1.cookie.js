const http = require('http');
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    let arr = []
    res.setCookie = function (key, value, options = {}) {
        let args = [];
        if (options.maxAge) {
            args.push(`max-age=${options.maxAge}`)
        }
        if (options.domain) {
            args.push(`domain=${options.domain}`)
        }
        if (options.path) {
            args.push(`path=${options.path}`)
        }
        if (options.httpOnly) {
            args.push(`httpOnly=${options.httpOnly}`)
        }
        arr.push(`${key}=${value};${args.join('; ')}`)
        res.setHeader('Set-Cookie', arr)
    }
    if (req.url == '/read') {
        let result = querystring.parse(req.headers.cookie, '; ', '=')
        res.end(JSON.stringify(result))
    } else if (req.url == '/write') {
        // res.setHeader('Set-Cookie',[`name=11;max-age=10;exipres=${new Date(Date.now() + 10*1000
        //     *1000).toGMTString()}`,'age=22']);

        //上述设置cookie的方式太麻烦了。需要改造一下
        // 改造为
        // res.setCookie('name','zf',{
        //     maxAge:10
        // })
        // 自己封装一个这样的方法
        res.setCookie('name', '111', {
            maxAge: 10,
            domain: '.test.cn', //设置二级域名访问，可以有效的减少cookie的发送
            path:"/write", // path限制只能在某个路径来访问cookie
            httpOnly:true //httpOnly只能服务端来操作cookie，相对安全一些，可以防止浏览器随便更改，但是在浏览器上还是可以手动修改
        })
        res.setCookie('age', '222')
        res.end('write ok')
    }
});

server.listen(3000)

//cookie可以设置存活时间，设置的字段名为 max-age/Exipres
//max-age/Exipres 是以秒为单位的。max-age（多少秒生效）/Exipres （绝对时间）

//domain 针对哪个域名生效（二级域名，a.test.com和b.test.com）