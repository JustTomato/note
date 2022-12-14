### 1.与Koa对比

>koa和express的区别
>
>1.express内部是通过回调函数的来实现的。koa则采用async/await的ES6语法，内部采用的promise
>
>2.两者都是基于http模块封装的，
>
>3.koa内部比较小巧，内部实现了主要use跟listen方法；在使用时则需要搭配其他的插件来使用像koa-static、koa-view、koa-router
>
>4.而express内部则包含了很多中间件，在使用中相对而言express会比koa使用的多一些
>
>5.两者都可以通过自己的规则来实现mvc功能
>
>6.koa底层使用了上下文对象，封装了ctx，而express则没有，内部使用了原生的res、req进行了封装
>
>7.koa和express都有中间件的概念，但是express内部不支持promise

[Express基于Node.js平台，快速、开放、极简的 Web 开发框架](https://www.expressjs.com.cn/4x/api.html)

### 2.简单地使用express

```js
const express = require('express'); //const koa = require('koa)

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

app.listen(3000)
```

### 3.查看express模块的结构，用于手动实现express

```tex
express
├─ index.js
├─ lib
│    ├─ application.js
│    ├─ express.js
│    ├─ middleware
│    │    ├─ init.js
│    │    └─ query.js
│    ├─ request.js
│    ├─ response.js
│    ├─ router
│    │    ├─ index.js
│    │    ├─ layer.js
│    │    └─ route.js
│    ├─ utils.js
│    └─ view.js
```

### 4.手动实现express

测试文件1.server.js

```js
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
app.all('*',function(req,res){
    res.end('all')
})
app.listen(3000,function(){
    console.log('server start')
})
```

express/index.js

```js
let express = require('./lib/express');
module.exports = express
```

express/lib/express.js

```js
const http = require('http');
const url = require('url');
const routes = [
    {
        path: '*',
        method: 'all',
        handler: (req, res) => { res.end(`Cannot ${req.method} ${req.url}`) }
    }
]

function createApplication() {
    return {
        all(path, callback) {
            routes.push({
                path,
                method: 'all',
                handler: callback
            })
        },
        get(path, callback) {
            routes.push({
                path,
                method: 'get',
                handler: callback
            })
        },
        listen(...args) {
            // Array.prototype.slice.call(arguments);
            const server = http.createServer((req, res) => {
                let { pathname } = url.parse(req.url);
                let requestMethod = req.method.toLowerCase();
                for (let i = 1; i < routes.length; i++) {
                    let { path, method, handler } = routes[i]
                    if ((pathname == path || path === '*') && (method === requestMethod || method === 'all')) {
                        return handler(req, res)
                    }
                }
                routes[0].handler(req, res)

            })
            server.listen(...args)
        }
    }
}

module.exports = createApplication
```

拆分express.js

> 1.createApplication 
>
> 2.application
>
> 3.router

1.在lib中新建application.js，拆分应用层

application.js

```js
const http = require('http');
const url = require('url');
const routes = [
    {
        path: '*',
        method: 'all',
        handler: (req, res) => { res.end(`Cannot ${req.method} ${req.url}`) }
    }
]
function Application() {

}
Application.prototype.get = function (path, callback) {
    routes.push({
        path,
        method: 'get',
        handler: callback
    })
};
// Application.prototype.all = function (path, callback) {
//     routes.push({
//         path,
//         method: 'all',
//         handler: callback
//     })
// };
Application.prototype.listen = function (...args) {
    // Array.prototype.slice.call(arguments);
    const server = http.createServer((req, res) => {
        let { pathname } = url.parse(req.url);
        let requestMethod = req.method.toLowerCase();
        for (let i = 1; i < routes.length; i++) {
            let { path, method, handler } = routes[i]
            // if ((pathname == path || path === '*') && (method === requestMethod || method === 'all')) {
            if (pathname == path && method === requestMethod) {
                return handler(req, res)
            }
        }
        routes[0].handler(req, res)

    })
    server.listen(...args)
}

module.exports = Application
```

express.js

```js
const Application = require('./application.js');
function createApplication() {
    return new Application()
}
module.exports = createApplication
```

2.应用系统跟路由系统的拆分，新建router文件夹（因为路由文件比较多），新建index.js



