
const LinkedList = require('./LinkedList')
//队列是 添加跟删除方法
class Queue {
    constructor() {
        this.ll = new LinkedList();
    }
    offer(element) { //加入队列
        this.ll.add(element)
    }
    poll() { //删除队列
        return this.ll.remove(0)
    }
}
module.exports = Queue