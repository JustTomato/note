const fs = require("fs");
const EventEmitter = require('events')
const Queue = require('./Queue')
class WriteStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'w';
        this.encoding = options.encoding || 'utf8';
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 16 * 1024;
        this.open();
        //需要判断是第一次写入还是后续的写入

        this.writing = false; //是否正在写入的标志
        this.needDrain = false;//是否触发drain事件
        this.len = 0 //统计写入的长度，默认0 累加
        this.offset = 0;//每次写入时的偏移量
        //缓存区 这里使用数组了，原本是使用链表的
        this.cache = new Queue; //实现缓存的
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) return this.emit('error', err);
            this.fd = fd;
            this.emit('open', fd);
        })
    }
    //这里有两write是因为用户调用write时，需要判断当前是否是真的写入还是写入缓存中
    write(chunk, encoding = this.encoding, cb = () => { }) {//chunk:写入的内容,encoding：编码格式
        //这里判断是写入还是缓存\
        //用户调用write方法时传入的内容可能是buffer类型或者是string类型
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        this.len += chunk.len;
        let ret = this.len < this.highWaterMark;
        if (!ret) {
            this.needDrain = true;
        }
        if (this.writing) {
            this.cache.offer({
                chunk,
                encoding,
                cb
            })
        } else {
            this.writing = true;
            this._write(chunk, encoding, () => {
                //先执行用户传递进来的cb
                cb();
                //清空缓存
                this.clearBuffer();
            })
        }
        return ret
    }
    clearBuffer() {
        let data = this.cache.poll();
        if (data) {
            let { chunk, encoding, cb } = data;
            this._write(chunk, encoding, () => {
                cb();
                //循环
                this.clearBuffer();
            })
        } else {
            //缓存中的需要写入的内容也全部写进去了。
            this.writing = false;
            //写完之后，查看需要需要触发drain事件
            if (this.needDrain) {
                this.needDrain = false;
                this.emit('drain')
            }
        }
    }
    _write(chunk, encoding, cb) {
        //这里是真是的写入操作即调用fs.write
        //在这里是拿不到fd的，所以还需要在绑一侧open事件
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._write(chunk, encoding, cb))
        }
        // console.log('this.fd',this.fd)
        fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
            this.len -= written;
            this.offset += written;
            cb();
            //写完之后需要清楚缓存
            // console.log(this.cache)
        })
    }
}

module.exports = WriteStream;