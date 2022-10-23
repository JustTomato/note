
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const url = require('url');
const { createReadStream, createWriteStream, readFileSync } = require('fs')
//渲染页面需要的模板引擎 ejs
const ejs = require('ejs')//需要安装
//文件类型
const mime = require('mime');
//打印颜色 chalk
// const chalk = require('chalk')
const crpto = require('crypto');

class Server {
    constructor(options) {
        this.port = options.port;
        this.directory = options.directory;
        this.template = readFileSync(path.resolve(__dirname, 'render.html'), 'utf8');
    }
    async handleRequest(req, res) {
        let { pathname } = url.parse(req.url)
        pathname = decodeURIComponent(pathname) //可能路径含有中文
        let filePath = path.join(this.directory, pathname);
        let statObj = await fs.stat(filePath);
        try {
            if (statObj.isFile()) {
                this.sendFile(req, res, statObj, filePath)
            } else {
                //需要列出来文件
                let dirs = await fs.readdir(filePath)
                dirs = dirs.map(item => ({//当前根据文件名产生目录和文件名
                    dir: item,
                    href: path.join(pathname, item)
                }))
                let result = await ejs.render(this.template, { dirs }, { async: true });
                res.setHeader('Content-Type', 'text/html;charset=utf-8')
                res.end(result)
            }
        } catch (e) {
            this.sendError(req, res, e)
        }

    }
    sendError(req, res, e) {
        res.statusCode = 404
        res.end('not found')
    }
    cache(req, res, statObj, filePath) {
        //设置缓存 默认强制缓存10s 10s内不再向服务器发起请求（首页不会被缓存，假设网络断开之后，还能找到缓存里的首页，不合理）
        //引用的资源可以被缓存
        res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()) //支持字符串格式 所以需要转字符串
        //新版本
        // res.setHeader('Cache-Control','no-cache');
        res.setHeader('Cache-Control', 'max-age=10');
        //no-cache：表示每次都向服务器发送请求 
        //no-store:表示浏览器不进行缓存
        //两者的区别：no-cache是已经做了缓存但是每次请求都不走缓存。no-store是根本就没有做缓存
        //http1.1跟新浏览器都能识别cache-control
        //max-age=10 是强缓存

        //但是如果文件在10s内发生修改之后呢？【有些文件可以这样设置，有些文件10s后还是不变】

        //协商缓存：协商是否需要返回最新的内容，如果不需要则直接给304状态码，表示找缓存即可

        //大概流程：默认先走强制缓存，10秒内不会发送请求到服务器中而是采用浏览器的缓存，但是10秒之后会再次发送请求，此时服务器就要进行对比。
        //1.文件没有变化，则直接返回状态码304即可。浏览器则会根据304状态码去浏览器缓存中查找对应的文件。
        //2.文件变化了。则会返回最新的文件内容。但10秒之后还是会走缓存。然后不停的循环

        //看文件是都变化
        //1.根据修改时间来判断文件是否修改了 面试常考的304考点【主要是服务端设置】
        let ifModiFiedSince = req.headers['if-modified-since']; //浏览器传递过来的时间（只有设置了Last-Modified 浏览器才会携带这个过来）
        let ctime = statObj.ctime.toGMTString();
        let ifNoneMatch = req.headers['if-none-match'];
        //设置Etag
        let etag = crpto.createHash('md5').update(readFileSync(filePath)).digest('base64');


        res.setHeader('Last-Modified', ctime);
        res.setHeader('Etag', etag)
        if (ifModiFiedSince != ctime) { //如果浏览器传递的时间跟服务器设置的一样则没有被修改过。
            return false
        }
        if (ifNoneMatch !== etag) {
            return false
        }

        
        statObj.ctime //文件对象里面有一个changetime 修改时间


        return true
    }
    sendFile(req, res, statObj, filePath) {

        if (this.cache(req, res, statObj, filePath)) {
            res.statusCode = 304;
            return res.end()
        } else {

        }


        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
        createReadStream(filePath).pipe(res);
    }
    start() {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(this.port, () => {
            // console.log(`${chalk.yellow('starting up zf-server:')}./${path.relative(process.cwd(), this.directory)}`);
            // console.log(`http://localhost:${chalk.green(this.port)}`)
        })
    }
}
module.exports = Server