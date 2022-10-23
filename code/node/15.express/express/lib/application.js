const http = require('http');
const url = require('url');
const Router = require('./router')
function Application() {
    this._router = new Router();
}
Application.prototype.get = function (path, callback) {
    // this._router._router.push() 和  this._router.get 相等

    this._router.get(path, callback)
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
        function done(){
            res.end(`cannot ${req.method}${req.url}`)
        }
        this._router.handle(req, res,done);
    })
    server.listen(...args)
}

module.exports = Application