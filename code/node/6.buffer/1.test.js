console.log(parseInt('11111111',2))
// console.log(255.toString(16)) //这样写代码会报错，因为JS的浮点数中会把.后面的当做是小数位，所以导致把toString当成小数位了
console.log(255.0.toString(16)) //字符串类型 可以将任何进制转换为任何进制

//经典的面试题
// 0.1+0.2的结果，为什么不等于0.3 
//将小数转化为二进制：乘2取整数
//例如
// 0.1 * 2 = 0.2   0
// 0.2 * 2 = 0.4   0
// 0.4 * 2 = 0.8   0
// 0.8 * 2 = 1.6   1   ===>    0.6
// 0.6 * 2 = 1.2   1   ===>    0.2
// 0.2 * 2 = 0.4   0
// ...

// 0.001100011...无限循环，为了表示有限的数，所以在后面往前进了一位1，导致0.1转化为二进制时是偏大的，而0.2也是如此，所以导致0.1+0.2不等于0.3



//base64是如何转化出来的？为什么叫base64呢？（用途：数据传递，有一些中文跟特殊符号无法传递时，就转为base64传递。还有可以替代URL路劲）(base64缺陷：数据转为base64之后，大小会比之前的要大三分之一。所以说base64不适用于转大图片)

let r = Buffer.from('珠');
console.log(r)//<Buffer e7 8f a0>
//node中不支持GBK编码只支持utf8

//怎么转成base64呢
//先把十六进制转为二进制
console.log(0xe7.toString(2))
console.log(0x8f.toString(2))
console.log(0xa0.toString(2))

//11100111 10001111 10100000
//转为base64
//111001 111000 111110 100000 【将三个字节八个位的格式拆分成四个字节六个位】
//所以这样子转化后，任何一个字节的6个位的值不会超过64，所以叫base64 【 111111  = 64】 

console.log(parseInt('111001',2))   //57
console.log(parseInt('111000',2))   //56
console.log(parseInt('111110',2))   //62
console.log(parseInt('100000',2))   //32

//57 56 62 32以上这些特定的值去哪里取值呢？去特定的base编码取值

let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
str+=str.toLowerCase();
str+='0123456789+/';
console.log(str[57] + str[56] + str[62] + str[32]); //54+g 这个就是转base64的结果

//以上是base64的原理，node中的buffer中有对应的api
console.log(Buffer.from('珠').toString('base64'))//54+g