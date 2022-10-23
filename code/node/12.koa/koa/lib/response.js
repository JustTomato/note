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