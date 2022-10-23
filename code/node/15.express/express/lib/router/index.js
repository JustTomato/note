const url = require('url');
function Router() {
    this._router = [
        
    ];

}
Router.prototype.get = function (path, callback) {
    this._router.push({
        path,
        method: 'get',
        handler: callback
    })
}

Router.prototype.handle = function (req, res,done) {
    let { pathname } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    for (let i = 0; i < this._router.length; i++) {
        let { path, method, handler } = this._router[i]
        // if ((pathname == path || path === '*') && (method === requestMethod || method === 'all')) {
        if (pathname == path && method === requestMethod) {
            return handler(req, res)
        }
    }
    //这里是找不到用户自己定义的路由，则返回交给应用层处理
    done()
}

module.exports = Router;