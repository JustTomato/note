
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