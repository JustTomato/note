### 1.什么是Cookie和Session

经典面试题

```
1.cookie session localStorage seesionstorage的区别

解：localStorage seesionstorage只能在前端使用，即本地访问，不能发送给服务器【不会在请求中携带，不能跨域】。seesionstorage是窗口关闭后就销毁了，localStorage是永久保存在浏览器中。localStorage seesionstorage两者的最大存储大小都是5mb。

解：cookie是一种http无状态协议，用来识别请求的，cookie既能在前端使用也能在后端使用，每次请求会携带cookie。如果跨域请求则不能携带cookie。cookie是存放在客户端的，所以就会存在安全的问题（篡改客户端的cookie，csrf攻击）（需要合理设置cookie，不然每次请求都会带上，浪费性能，而cookie本质是一个header，而header的最大为4k，所以cookie的最大也为4k）

解：session还是基于cookie的，session是存放在服务端的一个对象，通过一个唯一标识就可以找到对应的信息，而标识是通过cookie来发送的。
session理论是没有大小限制的（因为存放在服务端）

```

使用cookie

```js
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
```

由于在设置了httpOnly之后，浏览器在控制台中还是可以手动修改cookie的值。所以为了更加安全一些，需要对cookie进行添加签名校验

```js
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
```

实现显示访问次数

```js
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
```



使用Koa来设置cookie

```js
const koa = require('koa');

const app = new koa();
const Router = require('koa-router');
const router = new Router();
//Koa中专门用了一个字段来描述签名xxx.sign = 8tNxZ8XOLDDyYagdNPC9SpIOl5s

//Koa中签名的实现原理
// const crypto = require('crypto');
// console.log(crypto.createHmac('sha1','testpx').update('visit=13').digest('base64')) //8tNxZ8XOLDDyYagdNPC9SpIOl5s

app.keys = ['testpx'];
const session = {}; //用来记录映射关系的
const cardName = 'connect.sid'; //类似于卡号
router.get('/visit', (ctx, next) => {
    let visit = ctx.cookies.get('visit', { signed: true });
    if (visit) {
        visit++;
    } else {
        visit = 1
    }
    ctx.cookies.set('visit', visit, { signed: true });
    ctx.body = `当前用户访问第${visit}次`
})
app.use(router.routes())
app.listen(3000)
```

使用Koa来设置session

由于cookie在客户端可以被修改，安全性不高，所以需要搭配服务端的session来使用

```js
//模拟理发办会员消费的场景
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');
const router = new Router();
//Koa中专门用了一个字段来描述签名xxx.sign = 8tNxZ8XOLDDyYagdNPC9SpIOl5s

//Koa中签名的实现原理
// const crypto = require('crypto');
// console.log(crypto.createHmac('sha1','testpx').update('visit=13').digest('base64')) //8tNxZ8XOLDDyYagdNPC9SpIOl5s

app.keys = ['testpx'];
const session = {}; //用来记录映射关系的
const cardName = 'connect.sid'; //类似于卡号
router.get('/visit', (ctx, next) => {
    let cardId = ctx.cookies.get(cardName);
    if (cardId && session[cardId]) {
        session[cardId].mny -= 10;
        ctx.body = `您有${ session[cardId].mny}钱`
    } else {
        //Math.random() + Date.now().toString() 创建一个唯一的标志（示例使用而已）
        let cardId = Math.random() + Date.now().toString();
        ctx.cookies.set(cardName, cardId);
        session[cardId] = {mny:100};
        ctx.body = `您有${ session[cardId].mny}钱`
    }
    // let visit = ctx.cookies.get('visit', { signed: true });
    // if (visit) {
    //     visit++;
    // } else {
    //     visit = 1
    // }
    // ctx.cookies.set('visit', visit, { signed: true });
    // ctx.body = `当前用户访问第${visit}次`
})
app.use(router.routes())
app.listen(3000)
//但是浏览器刷新时就丢失
```

cookie跟session的区别

> cookie既可以在客户端设置也可以在服务端设置，但是cookie每次请求都会携带上，同时cookie不安全，因为cookie存放在客户端上（客户端可以随便修改它）
>
> session是借助cookie去使用的，使用时会注册一个唯一标识，根据唯一的标识去获取对应的数据，且session是存放在服务端上的。不可以随意更改

### 2.jwt

> json web token  令牌

是目前最流行的`跨域`身份验证解决方案

> JWT可以存储在cookie或者localstroage中

JWT实现原理

```js
const Koa = require('koa');
const Router = require('koa-router');
// const jsonwebtoken = require('jsonwebtoken') //这个在项目开发中使用比较多，这里为了演示则使用简单版的jwt
// const jwt = require('jwt-simple');
const crypto = require('crypto')


const router = new Router();
const app = new Koa();

//实现jwt原理
const jwt = {

    toBase64Url(content) {
        return content.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    ,
    toBase64(content) {
        return this.toBase64Url(Buffer.from(JSON.stringify(content)).toString('base64'))
    },
    sign(content, secret) {
        return this.toBase64Url(crypto.createHmac('sha256', secret).update(content).digest('base64'))
    },
    encode(payload, secret) {
        let header = this.toBase64({ typ: 'JWT', alg: 'HS256' });
        let content = this.toBase64(payload);
        let sign = this.sign(header + '.' + content, secret);
        return header + '.' + content + '.' + sign
    },
    base64urlUnescape(str) {
        str += new Array(5 - str.length % 4).join('=');
        return str.replace(/\-/g, '+').replace(/_/g, '/');
    },
    decode(token, secret) {
        let [header, content, sign] = token.split('.');
        let newSign = this.sign(header + '.' + content, secret);
        if (sign === newSign) {
            //令牌正确
            return JSON.parse(Buffer.from(this.base64urlUnescape(content), 'base64').toString());
        } else {
            throw new Error('令牌出错')
        }
    }
}


router.get('/login', async (ctx, next) => {

    //访问login时，生成一个令牌并返回
    let token = jwt.encode({
        username: 'admin',
        expires: new Date(Date.now() + 20 * 1000).toGMTString()
    }, 'test')

    ctx.body = {
        token
    }
    //"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6Ik1vbiwgMTAgT2N0IDIwMjIgMTQ6MjM6NDIgR01UIn0.6bVCelJlBy_-sTgmqpVH7bDvi2u3-LOkIMpjNuxoHb0"

    //"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6Ik1vbiwgMTAgT2N0IDIwMjIgMTQ6Mzc6NTQgR01UIn0.a6kwxVxhWWdmdxDEAcgbOTmHz38RqUJAGCvvM2M_xpk"
})

//客户端可以将令牌存放在cookie也可以直接在请求携带过去
router.get('/validate', async ctx => {
    let authorization = ctx.headers['authorization'];
    if (authorization) {
        let r = {};
        try {
            r = jwt.decode(authorization.split(' ')[1], 'test');
        } catch (e) {
            r.message = '令牌失效'
        }
        ctx.body = {
            ...r
        }
        // {
        //     "username": "admin",
        //     "expires": "Mon, 10 Oct 2022 14:52:34 GMT"
        // }
    }
})

app.use(router.routes())
app.listen(3000);

// session比较适合前后端同构的项目，而jwt适合前后端分离的项目
```

