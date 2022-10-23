
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