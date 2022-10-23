//常见的数据结构：队列 栈 链表 树
//

class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    add(index, element) {
        if (arguments.length == 1) {
            element = index; //当参数为一个时，所传进来的参数即是element
            index = this.size;
        }
        if (index < 0 || index > this.size) throw new Error('链表索引异常')
        if (index == 0) {
            let head = this.head;
            this.head = new Node(element, head)
        } else {
            let prevNode = this.getNode(index - 1)
            prevNode.next = new Node(element, prevNode.next);
        }
        this.size++
    }
    remove(index) {
        if(this.size == 0) return null;
        let oldNode;
        if (index == 0) {
            oldNode = this.head;
            this.head = oldNode && oldNode.next;
        } else {
            let prevNode = this.getNode(index - 1)//获取当前的节点
            oldNode = prevNode.next;//前一个节点的下一个节点就是需要删除的节点
            prevNode.next = oldNode.next//让前一个节点的下一个指向前一个节点的下一个
        }
        this.size--;
        return oldNode && oldNode.element
    }
    getNode(index) {
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next
        }
        return current
    }
    length() {
        return this.size;
    }
    reverseLinkedList(){
        function reverse(head){
            if(head ==null || head.next == null) return head;
            let newHead = reverse(head.next);//把链表的head设置为当前head的下一个
            head.next.next = head;
            head.next = null;
            return newHead
        }
        this.head = reverse(this.head);
        return this.head
    }
    reverseLinkedList1(){
        let head  = this.head;
        if(head ==null || head.next == null) return head;
        let newHead = null;//创建一个新的链表头部为null
        while(head != null){//循环旧的链表，将链表的每一项取出
            let temp= head.next; //先把head的next存起来防止丢失
            head.next = newHead; //旧链表的第一个指向新链表
            newHead = head;
            head = temp;//旧链表的head指向旧链表的下个
        }   
        this.head = newHead;
        return this.head;
    }
}
module.exports = LinkedList;

// let ll = new LinkedList();
// ll.add(0, 100) //200 100 300
// ll.add(0, 200)
// ll.add(300)
// let reverList = ll.reverseLinkedList1();
// console.log(reverList)