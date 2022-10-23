
const querystring = require('querystring') //koa自带的
const uuid = require('uuid'); //可以产生唯一的标识
const fs = require('fs');
const path = require('path')
module.exports = function bodyParse(uploadDir) {
    return async (ctx, next) => {
        ctx.request.body = await body(ctx,uploadDir);
        await next()
    }
}
function body(ctx, uploadDir) {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', function (chunk) {
            arr.push(chunk)
        });
        ctx.req.on('end', function () {
            //username=123&password=321
            //处理客户端传递过来的数据
            //1.表单格式 form-data a=1&b=2

            //2.json格式 {a:1,b:2}

            //3.文件格式


            //1.表单格式：application/x-www-form-urlencoded

            let type = ctx.get('content-type');
            let data = Buffer.concat(arr)
            if (type == 'application/x-www-form-urlencoded') {
                resolve(querystring.parse(data.toString()))
            } else if (type == 'application/json') {
                resolve(JSON.parse(data.toString()))
            } else if (type == 'text/plain') {
                resolve(data.toString())

                //此处当为文件类型是 不用使用这个来判断而是使用starstwith，因为请求头为multipart/form-data; boundary=----WebKitFormBoundaryBRPmZc6dYljFpCmo
            } else if (type.startsWith('multipart/form-data')) {
                // console.log(data.toString())此处不能转成string因为文件类型传递的数据是二进制的，转string时会乱码

                //根据分隔符进行数据的分割
                let boundary = '--' + type.split('=')[1];
                let lines = data.split(boundary)
                lines = lines.slice(1, -1);
                console.log(lines)
                let resultObj = {};
                lines.forEach(line => {
                    let [head, body] = line.split('\r\n\r\n')
                    if (head) {
                        let key = head.toString().match(/name="(.+?)"/)[1]
                        if (!head.includes('filename')) {
                            resultObj[key] = body.slice(0, -2).toString();
                        } else {
                            //文件上传
                            let originalName = head.toString().match(/filename="(.+?)"/)[1]
                            let filename = uuid.v4(); //可以产生唯一的文件名
                            console.log('-----------',filename)
                            //获取文件的内容
                            let content = line.slice(head.length + 4 - 2);
                            fs.writeFileSync(path.join(uploadDir,filename),content)
                            resultObj[key] = resultObj[key] || [];
                            resultObj[key].push({
                                size:content.length,
                                name:originalName,
                                filename
                            })
                        }
                    }
                });

                resolve(resultObj)
            } else {
                resolve()
            }

            //2.ajax格式

        })
    })
}

//拓展buffer上的分割方法 Buffer.indexOf('字符串')
Buffer.prototype.split = function (boundary) {
    let arr = [];
    let offset = 0;
    let currentPosition = 0;
    while (-1 != (currentPosition = this.indexOf(boundary, offset))) {
        arr.push(this.slice(offset, currentPosition))
        offset = currentPosition + boundary.length;
    }
    arr.push(this.slice(offset))
    return arr;
}
// console.log(Buffer.from('111111&11111&111&111').split('&'))