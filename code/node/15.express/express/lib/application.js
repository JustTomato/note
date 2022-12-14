const http = require('http');
const url = require('url');
const Router = require('./router')
function Application() {
    this._router = new Router();
}
Application.prototype.get = function (path, ...handlers) {
    this._router.get(path, handlers)
};
Application.prototype.listen = function (...args) {
    // Array.prototype.slice.call(arguments);
    const server = http.createServer((req, res) => {
        function done() {
            res.end(`cannot ${req.method}${req.url}`)
        }
        this._router.handle(req, res, done);
    })
    server.listen(...args)
}

module.exports = Application