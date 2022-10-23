const { Readable } = require('stream');
//Readable.prototype.read ==> ReadStream.prototype._read
class MyRead extends Readable {
    _read() {
        this.push('ojk'); //该PUSH是Readable中提供的【只要调用PUSH方法将读取到的结果放入，就会触发on('data')事件】
        this.push(null) //push(null)即结束push事件，终止循环放入读取的结果
    }
}
let mr = new MyRead();
mr.on('data', function (data) {
    console.log(data) //<Buffer 6f 6a 6b>
})
mr.on('end', function () {
    console.log('end')//end
})