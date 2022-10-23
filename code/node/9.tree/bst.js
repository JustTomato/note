//bst binary search tree

//tree有一个属性：parent 
class Node {
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;
        this.left = null;
        this.right = null;
    }
}
class BST {
    constructor() {
        this.root = null;
        this.size = 0
    }
    add(element) {
        if (this.root == null) {
            this.root = new Node(element, null)
            this.size++
            return
        }
        let currentNode = this.root; //从根开始找
        let parent = null;
        let compare = null;
        while (currentNode) {
            compare = element - currentNode.element;//节点与根节点的比较，确定元素放置左边右边
            parent = currentNode;
            if (compare > 0) {
                currentNode = currentNode.right;
            } else if (compare < 0) {
                currentNode = currentNode.left;
            }
        }
        let newNode = new Node(element, parent);
        if (compare > 0) {
            parent.right = newNode
        } else {
            parent.left = newNode
        }
        this.size++
    }
    preorderTraversal(visitor) {
        const traversal = (node) => {
            if (node == null) return
            visitor.visit(node)
            traversal(node.left);
            traversal(node.right);
        }
        traversal(this.root)
    }
    inorderTraversal(visitor) {
        const traversal = (node) => {
            if (node == null) return
            traversal(node.left);
            visitor.visit(node)
            traversal(node.right);
        }
        traversal(this.root)
    }
    postOrderTraversal(visitor) {
        const traversal = (node) => {
            if (node == null) return
            traversal(node.left);
            traversal(node.right);
            visitor.visit(node)
        }
        traversal(this.root)
    }
    levelOrderTraversal(visitor) {
        if (this.root == null) return
        let stack = [this.root] //根
        let index = 0;
        let currentNode = null;
        while (currentNode = stack[index++]) {
            visitor.visit(currentNode)
            if (currentNode.left) {
                stack.push(currentNode.left)
            }
            if (currentNode.right) {
                stack.push(currentNode.right)
            }
        }
    }
    invertTree() {
        if (this.root == null) return
        let stack = [this.root]
        let index = 0;
        let currentNode = null;
        while (currentNode = stack[index++]) {
            //左右互换即可
            let temp = currentNode.left;
            currentNode.left = currentNode.right;
            currentNode.right = temp;
            if (currentNode.left) {
                stack.push(currentNode.left)
            }
            if (currentNode.right) {
                stack.push(currentNode.right)
            }
        }
    }
}
let bst = new BST();
let arr = [10, 8, 19, 6, 15, 22, 20]
arr.forEach(item => {
    bst.add(item)
});
// bst.levelOrderTraversal({
//     visit(node) {
//         console.log(node.element)
//     }
// })
bst.invertTree()
console.log(bst.root)