const http = require('http');
const querystring = require('querystring')
const crypto = require('crypto');
function sign(value) {
    //不能支持Number类型 支持string跟buffer
    return crypto.createHmac('sha256', 'testpx').update(value + '').digest('base64').replace(/\/|\=|\+/g,'');
}
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
        if (options.signed) {
            value = value + '.' + sign(value)
        }
        arr.push(`${key}=${value};${args.join('; ')}`)
        res.setHeader('Set-Cookie', arr)
    }
    req.getCookie = function (key, options = {}) {
        let result = querystring.parse(req.headers.cookie, '; ', '=');
        let [value, s] = (result[key] || '').split('.');
        if (options.signed) {
            // console.log(s,sign(value))
            // 在浏览器中请求跟localstore里面的是一样的，但是代码打印出来的是去掉了加号的。所以印证了base64在传输过程中会把 + = / 转为空字符串【因为这三个字符在URL中有特殊的含义】
            // VEEWaY0wSRnI8nkPsXmkzCitjQu Rhiv/pZ6 y6rjP4= 
            // VEEWaY0wSRnI8nkPsXmkzCitjQu+Rhiv/pZ6+y6rjP4= 
            if (s === sign(value)) {
                return value
            } else {
                return undefined
            }
        } else {
            return value
        }
    }

    //每次访问服务器就统计客户端的访问次数 【项目开发中也会使用埋点这需求】
    if (req.url == '/visit') {
        let visit = req.getCookie('visit',{signed:true});
        if (visit) {
            visit++
        } else {
            visit = 1
        }
        res.setCookie('visit', visit,{signed:true})
        res.setHeader('Content-Type','text/html;charset=utf8')
        res.end(`当前用户第${visit}次访问`)
    }

    else if (req.url == '/read') {
        let ret = req.getCookie('name', {
            signed: true
        })
        res.end(ret)
    } else if (req.url == '/write') {
        res.setCookie('name', '111', {
            maxAge: 10,
            httpOnly: true,
            signed: true,
        })
        res.setCookie('age', '222')
        res.end('write ok')
    }
});
server.listen(3000)