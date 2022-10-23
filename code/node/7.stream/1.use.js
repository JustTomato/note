// const Stream = require('stream')
const fs = require('fs');
const path = require('path')
const ReadStream = require('./ReadStream')
//fs.createReadStream 内部是继承了Steam模块，且基于这几个方法fs.open fs.read fs.write fs.close实现的

const rs = new ReadStream(path.resolve(__dirname, 'test.txt'), {
    flags: 'r', //创建可读流的标志，r是读取文件
    encoding: null, //编码格式 null即默认是buffer类型
    autoClose: true, //是否读取完成之后关闭
    start: 0,//开始的位置
    end: 4,//结束的位置 【包前且包后 即0到4为 5个】
    highWaterMark: 2 //一次读取多少个 像这样子去读12 34 
})

rs.on('open', function (fd) {
    console.log(fd) //3
})

let str = '';
rs.on('data', function (chunk) {
    console.log(chunk)
    //<Buffer 31 32>
    //<Buffer 33 34>
    //<Buffer 35>
    str += chunk
})
rs.on('end', function () {
    console.log(str)
})


