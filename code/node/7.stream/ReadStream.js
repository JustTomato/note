const fs = require('fs');
const EventEmitter = require('events');
const path = require('path');
class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super()
        this.path = path;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding || null;
        if (typeof options.autoClose == 'undefined') {
            this.autoClose = true;
        } else {
            this.autoClose = options.autoClose;
        }
        this.start = options.start || 0;
        this.end = options.end || undefined;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.offset = this.start;//读取时的偏移量
        this.flowing = false; //默认非流动模式
        //默认就调用open方法开启可读流
        this.open();
        this.on('newListener', type => {
            if (type == 'data') { //即用户监听了data事件
                this.flowing = true;
                this.read();
            }
        })
    }
    pause() {
        this.flowing = false;
    }
    resume() {
        if (!this.flowing) {
            this.flowing = true;
            this.read();
        }
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) this.emit('error', err);
            this.fd = fd;//将文件描述符保存起来
            this.emit('open', fd);
        });
    }
    read() {
        // console.log('this.fd',this.fd) //this.fd undefined 此时这里执行时 open事件还没结束，因为open是异步的
        if (typeof this.fd != 'number') {
            return this.once('open', () => this.read());
        }
        // console.log(this.fd)//3
        const buffer = Buffer.alloc(this.highWaterMark);
        let howMuchToRead = Math.min((this.end - this.offset + 1), this.highWaterMark);//因为start跟end是包前又包后，所以相减的时候需要加上1
        //取最小值
        fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bytesRead) => {//bytesRead真正读取到的个数
            if (bytesRead) { //存在bytesRead即读取到了内容，此时就要去更改offset偏移量
                this.offset += bytesRead;
                this.emit('data', buffer.slice(0, bytesRead));
                //slice 是因为highWaterMark不传时是默认64*1024大小，但是有可能我们读取的内容小于这个字节数，就会导致buffer后面的全是空，应当截取掉
                if (this.flowing) {
                    this.read();
                }
            } else {
                this.emit('end');
                if (this.autoClose) {
                    fs.close(this.fd, () => {
                        this.emit('close')
                    })
                }
            }
        })
    }
}

module.exports = ReadStream