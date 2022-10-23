const path = require('path');
const fs = require('fs').promises;
const {createReadStream} = require('fs');
const mime = require('mime')
module.exports = function koaStatic(dirname) {
    return async (ctx, next) => {
        let filePath = path.join(dirname, ctx.path);
        try {
            let statObj = await fs.stat(filePath);
            if (statObj.isFile()) {
                ctx.set('Content-Type',mime.getType(filePath) + ';charset=utf-8')
                ctx.body = createReadStream(filePath)
            } else {
                //原则上需要加一层寻找HTML的逻辑，此处就省略了
                await next()
            }
        } catch (e) {
           await next()
        }

    }
} 