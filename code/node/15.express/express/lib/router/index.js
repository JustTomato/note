const url = require('url');
const Layer = require('./layer');
const Route = require('./route')
function Router() {
    this.stack = [];

}
//1.创建route 和layer并且layer要有一个route属性
Router.prototype.route = function (path) {
    let route = new Route();
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer)

    return route
}
Router.prototype.get = function (path, handlers) {
    let route = this.route(path);
    route.get(handlers)
}

Router.prototype.handle = function (req, res, done) {
    let { pathname } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();

    //1.先遍历外层的数组 异步迭代用函数
    let idx = 0
    const next = () => {
        if (this.stack.length == idx) return done();
        let layer = this.stack[idx++];
        if (layer.path === pathname) {
            layer.handler(req, res, next)//当这个handle处理完成之后还要执行next往下走
        } else {
            next()
        }
    }
    next();
}

module.exports = Router;