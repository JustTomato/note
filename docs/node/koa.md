

### 1.Koa简介

官网地址：[Koa(koa.js)中文网 -- 基于 Node.js 平台的下一代 web 开发框架 (koajs.com.cn)](https://www.koajs.com.cn/#introduction)

>Koa是有Express原班人马开发的。由于Express出现得比较早，在Express中是采用回调函数的方式实现的，而自从ES6出现之后。我们大多数的代码都是async/await实现的。而Koa也采用了这种方式实现，另外Koa对比Express在用途上并无差别，Koa体积相对Express少了很多封装中间件，显得更小更灵活。至于采用Koa亦或是Express项目需求而定。

注：[Egg.js](https://eggjs.github.io/zh/guide/)是基于Koa封装的

### 2.使用Koa

1.安装Koa

> 先初始化项目` npm init -y`并且安装Koa`npm install koa`

2.Koa用法

快速创建一个服务

```js
//use 为注册函数方法
//ctx Koa上下文，ctx是对原生的req和res进行了封装，封装成了一个新的参数 request和response【ctx上既有原生的req和res也有Koa自己封装的request和response】

const Koa = require('koa')
const app = new Koa(); //创建Koa应用

app.use(function(ctx){ 
//此处的function相当于Node中Http服务中handleRequest方法
//而handleRequest方法中是有req和res两个参数的。但是Koa直接提供了一个上下文的概念ctx，因为在Node中需要自己基于req和res参数处理自己所需要的数据（像处理Path处理URL）。所以Koa直接封装好了一个对象给我们使用
    //ctx是Koa中的上下文
    //此处接收到响应之后
    ctx.body = 'hello'
})
//监听3000端口
app.listen(3000)
```

查看Koa的文件结构

1.在node_modules文件中找Koa文件夹，其次找package.json文件中的main字段【main字段为入口文件】

` "main": "lib/application.js",`

2.根据main字段查看lib文件夹，lib文件夹只有四个文件，即这四个文件为Koa的主要文件。分别是`application.js` `request.js`  `response.js`  `context.js`

>`application.js`为项目的核心
>
>`context.js`是一个对象，为上下文

### 3.尝试自己实现Koa

1.新建Koa文件夹，并在koa文件夹中新建package.json文件

2.在package.json文件中增加main字段 [整个应用的入口]

```json
{
    "main":"./lib/application.js"
}
```

3.新建lib文件夹并新建application.js文件

先简单地实现一下

```js

const http = require('http')
class Application {
    use(fn) {
        this.fn = fn;//将use中的参数保存到实例上
    }
    handleRequest(req, res) {
        this.fn(req, res)
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}

module.exports = Application
```

用法

```js
const Koa = require('./koa')
const app = new Koa(); //创建Koa应用
app.use(function(req,res){ 
  res.end('hello11')
})
app.listen(3000)
```

继续完善 - 实现Koa的ctx上下文对象 【只要记住带res和req就是原生的，不带则是koa封装的】、

```js
console.log(ctx.req.url)//原生的req对象
console.log(ctx.request.req.url)//原生的req对象

console.log(ctx.request.url) //koa自己封装的
console.log(ctx.path)//koa自己封装的
```

在lib中新建request.js、response.js和context.js文件

注意：当我们在应用中去修改ctx.request对象时，例如` ctx.request.x = 1`，而我们又可以new Koa 多次创建多个服务。但是我们希望context是独立的！所以在创建新的应用时context都是一个新的！解决办法`Object.create(context)`

测试使用用例

```js
//1.
const Koa = require('./koa')

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


    ctx.body = "hello";
    ctx.body = "world";
    //ctx.body 并不是res.end('xxx')方法，因为ctx.body可以使用多次，且只取最后取一次。但是res.end()不能使用多次
    console.log(ctx.response.body);

    //或者可以这样使用
    ctx.response.body = "hello";
    ctx.response.body = "world";
    console.log(ctx.body);
   
})
//监听3000端口
app.listen(3000)


//use 为注册函数方法
//ctx Koa上下文，ctx是对原生的req和res进行了封装，封装成了一个新的参数 request和response【ctx上既有原生的req和res也有Koa自己封装的request和response】
```

application.js

```js
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
class Application {
    constructor() {
        //我们不能直接的把request赋值给context，如果其中的一个应用改变了request和response，就会导致其他的应用也跟着一块改
        this.context = Object.create(context);//此方法用于继承，可以继承原本的属性，但是用户新扩展的属性不会影响原来的上下文
        //即this.context随便怎么添加属性都不会影响到context!
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(fn) {
        this.fn = fn;//将use中的参数保存到实例上
    }
    createContext(req, res) {
        // let ctx = this.context; //这样赋值，会导致同个应用的多次请求也是用的同一个上下文，不合理
        //每次请求都创建一个新的上下文
        let ctx = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        // ctx.req = req;
        // ctx.res = res;
        ctx.request = request;
        ctx.response = response;
        ctx.request.req = ctx.req = req;
        ctx.response.res = ctx.res = res;
        return ctx
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res)
        //默认没有调用fn方法时，就默认给404
        res.statusCode= 404;
        this.fn(ctx)
        //用户多次设置，只采用最后一次
        let body = ctx.body;
        if(typeof body == 'string' || Buffer.isBuffer(body)){
            res.end(ctx.body)
        }else{
            res.end('Not Found')
        }
        
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}

module.exports = Application
```

context.js

```js
let proto = {

}
module.exports = proto;


function defineGetter(target, key) {
    proto.__defineGetter__(key, function () {
        return this[target][key]
    })
}
function defineSetter(target, key) {
    proto.__defineSetter__(key, function (value) {
        this[target][key] = value
    })
}
defineGetter('request', 'path');
defineGetter('request', 'url');
defineGetter('response', 'body');
defineSetter('response', 'body');
```

request.js

```js
const url = require('url')
module.exports = {
    get path() { //等价与Object.defineProperty
        // console.log(this) ctx.request
        // console.log(this.req.url)
        let { pathname } = url.parse(this.req.url);
        return pathname
    },
    get query() {
        let { query } = url.parse(this.req.url, true);
        return query
    },
    get header(){

    }
}
```

response.js

```js
module.exports = {
    //一般既能设置又能取值，需要一个第三方来控制
    _body:undefined,
    get body() {
        return this._body;
    },
    set body(val) {
        //当给ctx.body设置值的时候，就需要设置状态为200
        this.res.statusCode = 200;
        this._body = val;
    }
    
}
```

读取文件并返回 采用流的方式

测试例子

```js
const Koa = require('./koa')
const fs = require('fs')
const path = require('path')
const app = new Koa(); 

app.use(function(ctx){ 
    //读取内容
    //流的格式
    ctx.set('Content-Type','text/html')//设置响应头
    ctx.body= fs.createReadStream(path.resolve(__dirname,'a.html'))
    //json格式
    //ctx.body={"a":"1"}
})
//监听3000端口
app.listen(3000)
```

1.在根目录新建a.html文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    这是读取文件
</body>
</html>
```

增加流和JSON的处理 application.js

```js
const http = require('http');
const Stream = require('stream');
const context = require('./context');
const request = require('./request');
const response = require('./response');
class Application {
    constructor() {
        //我们不能直接的把request赋值给context，如果其中的一个应用改变了request和response，就会导致其他的应用也跟着一块改
        this.context = Object.create(context);//此方法用于继承，可以继承原本的属性，但是用户新扩展的属性不会影响原来的上下文
        //即this.context随便怎么添加属性都不会影响到context!
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(fn) {
        this.fn = fn;//将use中的参数保存到实例上
    }
    createContext(req, res) {
        // let ctx = this.context; //这样赋值，会导致同个应用的多次请求也是用的同一个上下文，不合理
        //每次请求都创建一个新的上下文
        let ctx = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        // ctx.req = req;
        // ctx.res = res;
        ctx.request = request;
        ctx.response = response;
        ctx.request.req = ctx.req = req;
        ctx.response.res = ctx.res = res;
        return ctx
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res)
        //默认没有调用fn方法时，就默认给404
        res.statusCode = 404;
        this.fn(ctx)
        //用户多次设置，只采用最后一次
        let body = ctx.body;
        if (typeof body == 'string' || Buffer.isBuffer(body)) {
            res.end(ctx.body)
        } else if (body instanceof Stream) {
            //设置成下载功能，只需要设置头部即可
            // res.setHeader('Content-Disposition',`attachment;filename=${encodeURIComponent('下载')}`);
            body.pipe(res);
        }else if(typeof body =='object'){
            res.end(JSON.stringify(body))
        } 
        else {
            res.end('Not Found')
        }

    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}

module.exports = Application
```

实现中间件



中间件的用处

>1.可以决定是否继续向下执行。【常见的使用场景是做权限：对访问路径进统一的拦截，如果路径不合法则不必向下执行】
>2.可以在中间件中拓展属性或者添加方法，【从第一个中间拓展一个方法之后，后面的中间件都可以获取得到】
>3.可以基于中间件写一个需要的插件【分割逻辑】

Koa中的特点归纳

> Koa中所有的代码都要携程promise才符合规范

1.Koa中所有的use函数中传入的方法都会被包装成promise【无论在传入的方法前面加不加async】

2.会把所有的promise集合变成一个promise链【想让每个中间件依次执行，则需要在next方法前面加await或者return。【return：一个promise返回一个promise】】例如

```js
const Koa = require('koa');
const app = new Koa();
app.use(async function(ctx,next){
    console.log(ctx.a)
    //await next()
    return next()
})

app.use(async function(ctx,next){
    console.log(ctx.a)
    await next()
})
app.listen(3000)
```

3.所有的异步逻辑代码都需要包装成promise【koa的规范要求】

一个简单的测试题【洋葱模型】

```js
const Koa = require('koa');
const app = new Koa();
app.use(async function(ctx,next){
    console.log(1)
    next()
    console.log(2)
})
app.use(async function(ctx,next){
    console.log(3)
    await next()
    console.log(4)
})

app.use(async function(ctx,next){
    console.log(5)
    await next()
    console.log(6)
})
app.listen(3000)
//135642
//解析：
//其实跟next前面加不加await没关系。不加输出的结果也是一样的。即洋葱模型
//【console.log(1)【console.log(3)【console.log(5)console.log(6)】 console.log(4)】console.log(2)】从坐到右依次执行
```

使用一个例子来解释为什么await前面一定需要加await

```js
const Koa = require('koa');
const app = new Koa();
const sleep= function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
            console.log('sleep')
        },1000)
    })
}
app.use(async function(ctx,next){
    console.log(1)
    next()
    console.log(2)
})
app.use(async function(ctx,next){
    console.log(3)
    await sleep()
    next()
    console.log(4)
})
app.use(async function(ctx,next){
    console.log(5)
    next()
    console.log(6)
})
app.listen(3000)

//1 3 2 sleep 5 6 4

//这里把next方法当作是下一个中间件整体，就比较容易理解了。
//当代码执行到一个中间件时，打印出来1，执行到next函数，由于没有await，则不等待，执行下一个中间件输出3，接着执行到了await sleep方法
//由于sleep前面有await，则需要等待，但是不阻塞代码继续向下执行到next()前，所以一个中间件执行完毕输出2
//接着代码继续向下执行，输出5 然后输出6 输出4
```

如果是在第一个中间件加了一个await

```js
const Koa = require('koa');
const app = new Koa();
const sleep= function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
            console.log('sleep')
        },1000)
    })
}
app.use(async function(ctx,next){
    console.log(1)
    await next()
    console.log(2)
})
app.use(async function(ctx,next){
    console.log(3)
    await sleep()
    next()
    console.log(4)
})
app.use(async function(ctx,next){
    console.log(5)
    next()
    console.log(6)
})
app.listen(3000)
//1 3 sleep 5 6 4 2
```

终上所述，如果存在异步代码则需要加await ，但是为了规范我们是每一个都加await

再来一个直接的例子

```js
const Koa = require('koa');
const app = new Koa();
const sleep= function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
            console.log('sleep')
        },1000)
    })
}
app.use(async function(ctx,next){
    ctx.body = 1
    next()
    ctx.body = 2
})
app.use(async function(ctx,next){
    ctx.body = 3
    await sleep()
    next()
    ctx.body = 4
})
app.use(async function(ctx,next){
    ctx.body = 5
    next()
    ctx.body = 6
})
app.listen(3000)

//页面上显示的是2，一个promise会等待另一个promise的执行！

const Koa = require('koa');
const app = new Koa();
const sleep= function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
            console.log('sleep')
        },1000)
    })
}
app.use(async function(ctx,next){ 
    ctx.body = 1
    await next()
    ctx.body = 2
})
app.use(async function(ctx,next){
    ctx.body = 3
    await sleep()
    next()
    ctx.body = 4
})
app.use(async function(ctx,next){
    ctx.body = 5
    next()
    ctx.body = 6
})
app.listen(3000)
//会等待1秒之后页面才输出2
```

那洋葱模型有什么好处呢？可以用来计时，从第一个代码执行到完成耗时多少

Koa1.0使用的是generator，已经不使用了。Koa2.0使用的是async/await

手动实现Koa的中间件 - application.js

```js
const http = require('http');
const Stream = require('stream');
const context = require('./context');
const request = require('./request');
const response = require('./response');
class Application {
    constructor() {
        //我们不能直接的把request赋值给context，如果其中的一个应用改变了request和response，就会导致其他的应用也跟着一块改
        this.context = Object.create(context);//此方法用于继承，可以继承原本的属性，但是用户新扩展的属性不会影响原来的上下文
        //即this.context随便怎么添加属性都不会影响到context!
        this.request = Object.create(request);
        this.response = Object.create(response);
        //存储中间价的数组
        this.middlewares = [];
    }
    use(fn) {
        // this.fn = fn;//将use中的参数保存到实例上
        this.middlewares.push(fn)
    }
    createContext(req, res) {
        // let ctx = this.context; //这样赋值，会导致同个应用的多次请求也是用的同一个上下文，不合理
        //每次请求都创建一个新的上下文
        let ctx = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        // ctx.req = req;
        // ctx.res = res;
        ctx.request = request;
        ctx.response = response;
        ctx.request.req = ctx.req = req;
        ctx.response.res = ctx.res = res;
        return ctx
    }
    compose(ctx){
        //需要将多个函数组合
        //总结：异步迭代用函数，同步迭代用循环
        let index = -1;
        const dispatch = (i) => {
            //use方法可能一个函数都没传
            if(index <= i) return Promise.reject('next() called multiples');
            if(this.middlewares.length == i) return Promise.resolve();
            index = i;
            let middleware = this.middlewares[i];
            return Promise.resolve(middleware(ctx,()=>dispatch(i+1)));
        }
        return dispatch(0)
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res)
        //默认没有调用fn方法时，就默认给404
        res.statusCode = 404;
        //compose方法返回一个promise
        this.compose(ctx).then(() => {
            //用户多次设置，只采用最后一次
            let body = ctx.body;
            if (typeof body == 'string' || Buffer.isBuffer(body)) {
                res.end(ctx.body)
            } else if (body instanceof Stream) {
                //设置成下载功能，只需要设置头部即可
                // res.setHeader('Content-Disposition',`attachment;filename=${encodeURIComponent('下载')}`);
                body.pipe(res);
            } else if (typeof body == 'object') {
                res.end(JSON.stringify(body))
            }
            else {
                res.end('Not Found')
            }
        })
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}

module.exports = Application
```

实现bodyParse插件



背景：服务端有可能从客户端获取到用户提交的数据，服务端需要进行将诶收数据并响应（例如Ajax）

```js
//服务端有可能从客户端获取到用户提交的数据，服务端需要进行将诶收数据并响应（例如Ajax）
const Koa = require('koa');
const app = new Koa();

//假设：
//1.当客户端访问/login且为get时，服务端需要返回一个登录页
//注释：表单提交没有跨域的问题，跨域是浏览器本身的问题;
app.use(async (ctx,next) => {
    if(ctx.path ==='/login' && ctx.method === 'GET'){
        ctx.body = `<form action="/login" method="post">
            <input type="text" name="username" />
            <input type="text" name="password" />
            <button>提交</button>
        </form>`
    }else{
        await next()
    }
})

//2.当客户端访问/login且为post时，服务端需要做登录操作
app.use(async (ctx,next) => {
    if(ctx.path ==='/login' && ctx.method === 'POST'){
        let arr= []
       ctx.req.on('data',function(chunk){
        arr.push(chunk)
       });
       ctx.req.on('end',function(){
        console.log(Buffer.concat(arr).toString())//username=123&password=321
        ctx.set('Content-Type','text/html;charset=utf-8')
        ctx.body = Buffer.concat(arr); 
        //这一步并不会把客户端提交的数据反显到页面上。因为function这个方法时异步的。
        //就算在上一个use函数中的next加await，也是不可以。因为next的await等待的是下一个use中的整个promise，并不会等待异步函数
       })
    }else{
        next()
    }
})
app.listen(3000)
```

把接收数据部分函数基于Promise封装就可以显示在页面上了

```js
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx, next) => {
    if (ctx.path === '/login' && ctx.method === 'GET') {
        ctx.body = `<form action="/login" method="post">
            <input type="text" name="username" />
            <input type="text" name="password" />
            <button>提交</button>
        </form>`
    } else {
        await next()
    }
})
function body(ctx) {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', function (chunk) {
            arr.push(chunk)
        });
        ctx.req.on('end', function () {
            resolve(Buffer.concat(arr))
        })
    })
}
app.use(async (ctx, next) => {
    if (ctx.path === '/login' && ctx.method === 'POST') {
        ctx.set('Content-Type','text/html;charset=utf-8')
        ctx.body = await body(ctx);
    } else {
        next()
    }
})
app.listen(3000)
```

把上面的body方法封装成中间件，这样一来后面所有的use都会使用这个中间件

```js
const Koa = require('koa');
const app = new Koa();
const bodyParse = require('./koa-bodparse')
app.use(bodyParse()) 
app.use(async (ctx, next) => {
    if (ctx.path === '/login' && ctx.method === 'GET') {
        ctx.body = `<form action="/login" method="post">
            <input type="text" name="username" />
            <input type="text" name="password" />
            <button>提交</button>
        </form>`
    } else {
        await next()
    }
})

app.use(async (ctx, next) => { 
    if (ctx.path === '/login' && ctx.method === 'POST') {
        ctx.set('Content-Type','text/html;charset=utf-8')
        ctx.body = ctx.request.body
    } else {
        next()
    }
})
app.listen(3000)
```

新建koa-bodparse.js文件

```js
module.exports = function bodyParse() {
    return async (ctx, next) => {
        ctx.request.body = await body(ctx);
        await next()
    }
}
function body(ctx) {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', function (chunk) {
            arr.push(chunk)
        });
        ctx.req.on('end', function () {
            //username=123&password=321
            //处理客户端传递过来的数据
            //1.表达格式 form-data a=1&b=2
            //2.json格式 {a:1,b:2}
            //3.文件格式
            resolve(Buffer.concat(arr))
        })
    })
}
```

处理客户端传递过来的数据

使用

```js
const Koa = require('koa');
const app = new Koa();
const bodyParse = require('./koa-bodparse');
const static = require('./koa-static');
const path = require('path')
app.use(bodyParse())
app.use(static(path.resolve(__dirname,'koa')))
app.use(static(__dirname));
app.use(async (ctx, next) => { 
    if (ctx.path === '/login' && ctx.method === 'POST') {
        ctx.set('Content-Type','text/html;charset=utf-8')
        ctx.body = ctx.request.body
    } else {
        next()
    }
})
app.listen(3000)
```

新建koa-static.js

```js
const path = require('path');
const fs = require('fs').promises;
const {createReadStream} = require('fs');
const mime = require('mime')
module.exports = function koaStatic(dirname) {
    return async (ctx, next) => {
        let filePath = path.join(dirname, ctx.path);
        try {
            let statObj = await fs.stat(filePath);
            if (statObj.isFile()) {
                ctx.set('Content-Type',mime.getType(filePath) + ';charset=utf-8')
                ctx.body = createReadStream(filePath)
            } else {
                await next()
            }
        } catch (e) {
           await next()
        }
    }
} 
```

上面两个中间件 在koa中有对应的模块包。分别为`koa-bodyparser`  `koa-static`

 接收客户端数据的处理

body-parse.js

```js

const querystring = require('querystring') //koa自带的

module.exports = function bodyParse() {
    return async (ctx, next) => {
        ctx.request.body = await body(ctx);
        await next()
    }
}
function body(ctx) {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', function (chunk) {
            arr.push(chunk)
        });
        ctx.req.on('end', function () {
            //username=123&password=321
            //处理客户端传递过来的数据
            //1.表单格式 form-data a=1&b=2
            //2.json格式 {a:1,b:2}
            //3.文件格式
            //1.表单格式：application/x-www-form-urlencoded

            let type = ctx.get('content-type');
            let data = Buffer.concat(arr)
            if (type == 'application/x-www-form-urlencoded') {
                resolve(querystring.parse(data.toString()))
            } else if (type == 'application/json') {
                resolve(JSON.parse(data.toString()))
            } else if (type == 'text/plain') {
                resolve(data.toString())
            } else {
                resolve()
            }
        })
    })
}
```

测试例子login.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="/login" method="post">
        <input type="text" name="username" />
        <input type="text" name="password" />
        <button>提交</button>
    </form>
    <script>
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function () {
            console.log(xhr.response)
        }
        xhr.send(JSON.stringify({a:1,b:2}))
    </script>
</body>

</html>
```

文件类型的处理



```tex
------WebKitFormBoundarymESMEunwsrLMjta4
Content-Disposition: form-data; name="username"

123
------WebKitFormBoundarymESMEunwsrLMjta4
Content-Disposition: form-data; name="password"

321
------WebKitFormBoundarymESMEunwsrLMjta4
Content-Disposition: form-data; name="avatar"; filename="a.txt"
Content-Type: text/plain

hello
------WebKitFormBoundarymESMEunwsrLMjta4--
```

koa-bodparse.js

```js
const querystring = require('querystring') //koa自带的
const uuid = require('uuid'); //可以产生唯一的标识
const fs = require('fs');
const path = require('path')
module.exports = function bodyParse(uploadDir) {
    return async (ctx, next) => {
        ctx.request.body = await body(ctx,uploadDir);
        await next()
    }
}
function body(ctx, uploadDir) {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', function (chunk) {
            arr.push(chunk)
        });
        ctx.req.on('end', function () {
            //username=123&password=321
            //处理客户端传递过来的数据
            //1.表单格式 form-data a=1&b=2

            //2.json格式 {a:1,b:2}

            //3.文件格式


            //1.表单格式：application/x-www-form-urlencoded

            let type = ctx.get('content-type');
            let data = Buffer.concat(arr)
            if (type == 'application/x-www-form-urlencoded') {
                resolve(querystring.parse(data.toString()))
            } else if (type == 'application/json') {
                resolve(JSON.parse(data.toString()))
            } else if (type == 'text/plain') {
                resolve(data.toString())
                //此处当为文件类型是 不用使用这个来判断而是使用starstwith，因为请求头为multipart/form-data; boundary=----WebKitFormBoundaryBRPmZc6dYljFpCmo
            } else if (type.startsWith('multipart/form-data')) {
                // console.log(data.toString())此处不能转成string因为文件类型传递的数据是二进制的，转string时会乱码

                //根据分隔符进行数据的分割
                let boundary = '--' + type.split('=')[1];
                let lines = data.split(boundary)
                lines = lines.slice(1, -1);
                console.log(lines)
                let resultObj = {};
                lines.forEach(line => {
                    let [head, body] = line.split('\r\n\r\n')
                    if (head) {
                        let key = head.toString().match(/name="(.+?)"/)[1]
                        if (!head.includes('filename')) {
                            resultObj[key] = body.slice(0, -2).toString();
                        } else {
                            //文件上传
                            let originalName = head.toString().match(/filename="(.+?)"/)[1]
                            let filename = uuid.v4(); //可以产生唯一的文件名
                            console.log('-----------',filename)
                            //获取文件的内容
                            let content = line.slice(head.length + 4 - 2);
                            fs.writeFileSync(path.join(uploadDir,filename),content)
                            resultObj[key] = resultObj[key] || [];
                            resultObj[key].push({
                                size:content.length,
                                name:originalName,
                                filename
                            })
                        }
                    }
                });

                resolve(resultObj)
            } else {
                resolve()
            }

            //2.ajax格式

        })
    })
}
//拓展buffer上的分割方法 Buffer.indexOf('字符串')
Buffer.prototype.split = function (boundary) {
    let arr = [];
    let offset = 0;
    let currentPosition = 0;
    while (-1 != (currentPosition = this.indexOf(boundary, offset))) {
        arr.push(this.slice(offset, currentPosition))
        offset = currentPosition + boundary.length;
    }
    arr.push(this.slice(offset))
    return arr;
}
// console.log(Buffer.from('111111&11111&111&111').split('&'))
```

body.js

```js
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
```

使用页面login.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="/login" method="post" enctype="multipart/form-data">
        <!-- enctype="application/x-www-form-urlencoded" 以前是这种存的是表单格式的a=1&b=2-->
        <!-- 当为上传文件时则需要 enctype="multipart/form-data"规定的 -->
        <input type="text" name="username" />
        <input type="text" name="password" />
        <input type="file" name="avatar" multiple>
        <button>提交</button>
    </form>
    <script>
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function () {
            console.log(xhr.response)
        }
        xhr.send(JSON.stringify({a:1,b:2}))
    </script>
</body>
</html>
```

### 4.Koa的应用

入口文件 - index.js

渲染模板 - views文件夹

存放路由 - routes文件夹

路由对应的处理逻辑 -controller

数据处理 - model

公共文件 - public

index.js

```js
//views 关于模版引擎的文件
//routes 路由 可以使用Koa-router 根据不同的功能来划分路由
//model 存放数据库相关的
//controller 控制器：每一个路由都对应一个控制器
//services 提供服务，控制器中可以使用服务中的数据

//博客系统 文章管理和用户管理

const Koa = require('koa');
const app = new Koa();
const bodyparser = require('koa-bodyparser');
const static = require('koa-static');
const views = require('koa-views')
const path  = require('path')

const router = require('./routes/index');//获得路由系统

// console.log(router)
//先解析再路由
app.use(bodyparser());
app.use(views(path.resolve(__dirname,'views'),{
    map:{
        'html':'ejs'
    }
}))
app.use(static(path.resolve(__dirname,'public')));
//注册路由
app.use(router());
//模板引擎 
//npm install ejs koa-views koa-static koa-bodyparser

app.listen(3000)
```

controller

articleController.js

```js
class ArticleController{
    add(ctx,next){
        ctx.body = '文章添加'
    }
    list(ctx,next){
        ctx.body = '文章列表'
    }
}

module.exports = ArticleController;
```

userController.js

```js
class UserController{
    async add(ctx,next){
        // ctx.statusCode = 200;
        ctx.body = '用户添加';
        await ctx.render('a.html',{name:100})
    }
    list(ctx,next){
        ctx.body = '用户列表'
    }
}

module.exports = UserController;
```

public - index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    hello
</body>
</html>
```

routes

articleRouter.js

```js
//1.心间对应模块的路由：添加文章 文章查询
//2.引入对应的控制器
const ArticleController = require('../controller/articleController');
let Router = require('koa-router');
let articleCtrl = new ArticleController();
//划分前缀，像文章都是article开头 article/add article/remove
const router = new Router({prefix:'/article'});
console.log('-----',articleCtrl)
router.get('/add',articleCtrl.add);
router.get('/list',articleCtrl.list); //每一个路由对应一个控制器，所以需要在controller文件夹中心间对应的控制器

module.exports = router
```

index.js

```js
//整合模块
let articleRouter = require('./articleRouter');
let userRouter = require('./userRouter');

let combineRouters = require('koa-combine-routers');
module.exports = combineRouters(articleRouter,userRouter)
```

userRouter.js

```js
//1.心间对应模块的路由：
//2.引入对应的控制器

const UserController = require('../controller/userController');
let Router = require('koa-router');
let userCtrl = new UserController();
const router = new Router({prefix:'/user'});

router.get('/add',userCtrl.add);
router.get('/list',userCtrl.list);

module.exports = router
```

views - a.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <%=name%>
</body>
</html>
```

