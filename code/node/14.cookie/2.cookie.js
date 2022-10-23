const http = require('http');
const querystring = require('querystring')
const crypto = require('crypto');
function sign(value) {
    //加盐算法：防御不同的密钥产生不同的结果。具有不可逆
    return crypto.createHmac('sha256', 'testpx').update(value).digest('base64');
    //base64格式在传输的过程中会把+ = / 都转换成空字符串
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
            //值 + . 的签名
            value = value + '.' + sign(value)
        }
        arr.push(`${key}=${value};${args.join('; ')}`)
        res.setHeader('Set-Cookie', arr)
    }
    req.getCookie = function (key, options = {}) {
        let result = querystring.parse(req.headers.cookie, '; ', '=');
        let [value, s] = (result[key] || '').split('.');
        if (options.signed) {
            if (s === sign(value)) {
                return value
            } else {
                return undefined
            }
        } else {
            return value
        }
    }
    if (req.url == '/read') {
        // let result = querystring.parse(req.headers.cookie, '; ', '=')
        let ret = req.getCookie('name', {
            signed: true
        })
        res.end(ret)
    } else if (req.url == '/write') {
        res.setCookie('name', '111', {
            maxAge: 10,
            httpOnly: true,
            signed: true, //signed 表示增加签名
        })
        res.setCookie('age', '222')
        res.end('write ok')
    }
});
server.listen(3000)