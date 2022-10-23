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