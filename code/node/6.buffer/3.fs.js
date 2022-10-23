//fs方法一般有两种类型：同步方法（带有sync） 异步方法
const fs = require('fs');
const path=require('path');
//特点
//1.如果是读取文件，读取到的结果默认是buffer类型 【另外读取文件时，尽量采取绝对路径】
fs.readFile(path.resolve(__dirname,'note.md'),function(err,data){
    if(err) return 
    console.log(data) //不带'utf8'参数时，读取到的是buffer类型数据 <Buffer 31 31 31>
    console.log(data.toString())//111
}) 
//注意：如果是读取图片时，编码格式我utf8会导致乱码并死机。图片格式可以转base64编码 【前端读取到base64格式数据时不会去请求资源，因为base64就是可以被URL直接识别的！】

//2.有读取文件就有写入文件（即读取到的数据写入文件）。写入的时候会清空文件内容，并以utf8的格式写入
// 1）读取到的内容都会被临时放到内存当中 
// 2）如果读取的文件内容过大很导致浪费内存（消耗性能）
// 3）如果是大型文件会淹没可用内存，所以大型文件不能采用这种方式（小型的JS文件CSS文件则可以，一般是64k以上的大小文件就建议尽量不要采用readFile这种方式来操作）
fs.readFile(path.resolve(__dirname,'note.md'),function(err,data){
    fs.appendFile(path.resolve(__dirname,'test.md'),data,function(err,data){
        console.log('copy success')
    })
})