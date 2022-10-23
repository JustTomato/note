// const { Duplex } = require('stream');

// class MyDuplex extends Duplex {
//     _read() {
//         this.push('xxx')
//         this.push(null)
//     }
//     _write(chunk,encoding,cb) {
//         console.log(chunk) //<Buffer 6f 6b>
//         cb();
//     }
// }
// let md = new MyDuplex();
// md.on('data',function(chunk){
//     console.log(chunk)
// })
// md.write('ok')
//<Buffer 6f 6b>
//<Buffer 78 78 78>


//转化流 可用加密、压缩等操作 【可以把金可写流转化为可读流】

const { Transform } = require('stream');
class MyTransform extends Transform {
    _transform(chunk, encoding, cb) {
        console.log(chunk)
        this.push(chunk.toString().toUpperCase())
        cb();
    }
}

let my = new MyTransform();
// process.stdin.on('data', function (chunk) {
//     cobnsol.log(chunk)
// })


process.stdout.write('ok') //ok 相当于console.log()

//监听用户输入
// process.stdin.on('data',function(chunk){
//     process.stdout.write(chunk)
// })

process.stdin.pipe(process.stdout)

//监听到用户输入的内容进行转化
process.stdin.pipe(my).pipe(process.stdout)