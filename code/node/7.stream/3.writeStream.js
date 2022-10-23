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

// // ws会有一个返回值来判断写入的字节数是否达到highWaterMark的水位线
// let flag1 = ws.write('123123');
// console.log(flag1) //false
// let flag2 = ws.write('12');
// console.log(flag2) //false
// let flag3 = ws.write('1');
// console.log(flag3) //true





// ws.write('1')
// ws.write('2')
// ws.write('3')
// ws.write('4')
// ws.write('5')
// ws.write('6')
// ws.write('7')
//由于write方法是异步方法，即不会一次性同时写入7个字节，为什么write方法是异步的呢？假设是同步的话，那七个同时写入，谁先从0开始写，后面的又该从哪个位置写呢？所以是异步的
//这里write方法采用的链表的格式来存储，将多个异步方法排队依次执行，为什么要用链表呢？是因为在取头部的时候，数组会有塌陷的问题即后面的依次往前排，这样导致性能不高，所以采用的链表的格式
//highWaterMark跟ws返回的标志是用来限制，放入异步队列的大小，即默认是16k,即只去读取16k的内容放入链表中，如果没有这个限制，假设读取1G的内容，那岂不是读取到的1G的内容都要放到内存中，浪费内存
