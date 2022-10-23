const fs = require('fs');
const path = require('path');
const WriteStream = require('./WriteStream')

//演示使用示例时才传递参数，使用时是不传的，有默认值
const ws= new WriteStream(path.resolve(__dirname,'test.text'),{
    flags:'w',
    encoding:'utf8',
    autoClose:true,
    highWaterMark: 2//写的默认水位线是16k
});
//可写流中有这几个方法：ws.write(),ws.end(),ws.on('open),ws.on('close')

ws.on('open',function(fd){
    console.log(fd) //3
})
 
// ws.write(123) //write方法只能传string类型跟buffer类型的值 The "chunk" argument must be of type string or an instance of Buffer or Uint8Array

ws.write('123',function(){ //highWaterMark 对于可写流来说是没有限制作用的，只是一个警示作用。此处highWaterMark为2，但是可以一次性写入3个字节
    console.log('write end')
})
ws.write('123',function(){ //highWaterMark 对于可写流来说是没有限制作用的，只是一个警示作用。此处highWaterMark为2，但是可以一次性写入3个字节
    console.log('write end')
})
ws.on('drain', function () {
    console.log('drain')
})