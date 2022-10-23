const { V4MAPPED } = require('dns');
const fs = require('fs');

const result = fs.readFileSync('./test.text','utf8');
console.log(result)
const bool = fs.existsSync('./test.text');
console.log(bool)


const path = require('path');
const res = path.resolve('test.text');
console.log(res)
const res1 = path.resolve(__dirname,'test.text','a');
console.log(res1)




console.log(path.join('a','b')) //只是简单的拼接在一块。
//a\b
//此时会出现下列一样的结果
console.log(path.resolve(__dirname,'test.text','a'))
console.log(path.join(__dirname,'test.text','a'))
//c:\Users\87631\Desktop\test\node\3.node\test.text\a
//c:\Users\87631\Desktop\test\node\3.node\test.text\a

//它俩有什么区别呢：如果遇到带/的路劲，resolve会认为是根路径，而join则只是简单的拼接在一起。例如
console.log(path.resolve(__dirname,'test.text','/'))
console.log(path.join(__dirname,'test.text','/'))
//c:\
//c:\Users\87631\Desktop\test\node\3.node\test.text\
console.log(path.extname('a.min.js'))

console.log(path.relative('a','a/a.js'))
console.log(path.dirname(__dirname))

const vm = require('vm')
//eval
let a = 100;
const log = 'console.log(a)';
eval(log)//100

let fn  = new Function(log);
console.log(fn.toString())


vm.runInThisContext(log)