const Layer = require('./layer')
function Route() {
    this.stack = [];
}


Route.prototype.dispatch = function (req, res, out) {
    //循环当前route中的layer并依次执行
    let idx = 0;
    const next = () => {
        if (this.stack.length === idx) return out();
        let layer = this.stack[idx++];
        if (layer.method == req.method.toLowerCase()) {
            layer.handler(req, res, next)
        } else {

        }
    }
    next();
}
Route.prototype.get = function (handlers) {
    handlers.forEach(handler => {
        const layer = new Layer('', handler);
        layer.method = 'get';
        this.stack.push(layer)
    });
}

module.exports = Route;