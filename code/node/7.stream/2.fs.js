//1.内部会先new ReadStream 继承于Readable接口
//2.内部会先进行格式化
//3.内部会默认打开文件，即ReadStream.prototype.read
//4.Readable.prototype.read ==> ReadStream.prototype._read