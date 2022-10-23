const buffer = Buffer.alloc(6) //声明一个buffer类型，大小为6个字节
console.log(buffer) //<Buffer 00 00 00 00 00 00>
//注意buffer是固定大小，也就是声明之后不能更改大小了，即不能扩容，但是可以通过对应的索引去更改对应的值
buffer[1] = 100;
buffer[100] = 100;//不生效
console.log(buffer) //<Buffer 00 64 00 00 00 00>

//老写法【已经废弃】 new Buffer()

//也可以使用这种方式声明buffer
const buffer1 = Buffer.from('这是测试');
console.log(buffer1)//<Buffer e8 bf 99 e6 98 af e6 b5 8b e8 af 95>
console.log(buffer1.length) //12 buffer的长度是代表字节数
console.log(buffer1.toString()) //这是测试 【不传参数，默认会传递utf8】
console.log(buffer1.toString('utf8')) //这是测试 【常见的参数有utf8 base64 另外不支持gbk】

//还有这种方式，但是基本用不到
const buffer2 = Buffer.from([1,23,4,100]);
console.log(buffer2) //<Buffer 01 17 04 64>

//二进制是以0b开头的，八进制是以0o开头的（前端可以直接用0开头表示，省略o）十六进制是0x开头的

//虽然buffer的大小是无法更改的，但还是可以通过重新声明一个buffer空间然后将结果拷贝过去！copy 【这种方式传参数太多，不友好不常用】
const newBuffer = Buffer.alloc(12);

const buffer3 = Buffer.from('这是');
const buffer4 = Buffer.from('测试');
buffer3.copy(newBuffer,0,0,6);
buffer4.copy(newBuffer,6,0,6);
console.log(newBuffer)//<Buffer e8 bf 99 e6 98 af e6 b5 8b e8 af 95>

//copy的实现原理
Buffer.prototype.copy = function (targetBuffer,targetStart,sourceStart=0,sourceEnd = this.length) {
    for(let i = sourceStart; i< sourceEnd ;i++){
        targetBuffer[targetStart++] = this[i]
    }
}
//另外一种方式 concat
const newBuffer1 = Buffer.concat([buffer3,buffer4])
console.log(newBuffer1)//<Buffer e8 bf 99 e6 98 af e6 b5 8b e8 af 95>
console.log(Buffer.isBuffer(newBuffer1))//true

//concat的实现原理
Buffer.concat = function (bufferList, length = bufferList.reduce((a,b)=>a+b.length,0)) {
    let buf = Buffer.alloc(length);
    let offset = 0
    bufferList.forEach(bufItem => {
        bufItem.copy(buf,offset);
        offset += bufItem.length;
    });
    return buf.slice(0,offset) //buf.slice(0,offset)这一步是截取掉因为第二个参数传进来的数组太大导致的空
}

//buffer 没有push pop等方法