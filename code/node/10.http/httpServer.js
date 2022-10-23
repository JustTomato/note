//服务器一般具有两个功能：返回静态文件和返回数据

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const { createReadStream } = require('fs');
const mime = require('mime')

// http.createServer(() => {}) //node大多数代码都是有回调函数的。但是我们在日常开发中要放弃这种写法，要基于Promise + async/await的写法

class staticServer {
    //第一种
    // handleRequest() {
    //     return ()=>{
    //         console.log(this)
    //     }
    // }
    async handleRequest(req, res) {
        // console.log(this)
        const { pathname } = url.parse(req.url, true)
        //根据路径返回对应的资源
        let filePath = path.join(__dirname, pathname)
        console.log(filePath)
        //判断是否为文件夹 
        //这里采用异步的fs.stat而不是采用同步的fs.existsSync，因为是：比如去读取/node.md文件时，该文件非常大，
        //此时访问localhost:3000/note.md一直在读取中，会导致后续用户不论是访问localhost:3000/a还是其他的都是在等待一个执行完毕，阻塞了。所以需要才用异步
        try {
            let statObj = await fs.stat(filePath);
            if (statObj.isFile()) {
                //文件
                //1.最low的写法
                // let data = await fs.readFile(filePath)
                // res.end(data)

                //2.改用流的方式
                //设置header头
                //但是文件类型写死了。不够灵活，用户要是请求其他类型的文件呢？所以要动态的获取文件类型。可以使用mime模块 【npm install mime】
                // res.setHeader('Content-Type','text/html;charset=utf-8')
                res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
                createReadStream(filePath).pipe(res); //res是一个可写流  pipe方法的调用就是：可读流.pipe(可写流)

            } else {
                //文件夹
                filePath = path.join(filePath,'index.html');
                await fs.access(filePath) //异步方法，判断这个文件是否能访问，也可以使用同步方法fs.existsSync
                res.setHeader('Content-Type','text/html;charset=utf-8')
                createReadStream(filePath).pipe(res);
            }
        } catch (e) {
           this.sendError(e,req,res)
        }

    }
    sendError(e,req,res){
        res.statusCode = '404'
        res.end('not found')
    }
    //第二种 http.createServer(() => this.handleRequest())
    start(...args) {
        const server = http.createServer(this.handleRequest.bind(this)) //第三种 
        server.listen(...args)
    }
}
new staticServer().start(3000, function () {
    console.log(`server start 3000`)
})