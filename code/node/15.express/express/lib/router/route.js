const Layer = require('./layer')
function Route() {
    this.stack = [];
}


Route.prototype.dispatch = function(){
    //循环当前route中的layer并依次执行
    
}

module.exports = Route;