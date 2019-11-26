/**
 * @class Node
 * @classdesc 节点
 */
export class LinkNode {
    /**
     * 元素
     */
    element: any = null;

    /**
     * 下一个节点
     */
    next: LinkNode = null;
    /**
     * 上一个节点
     */
    previous: LinkNode = null;


    constructor (element: any) {
        this.element = element;
        this.next = null;
        this.previous = null;
    }
}

/**
 * @class  CicleLinkedList
 * @classdesc 循环链表
 * @TODO 没有实现其它方法
 */
export class CicleLinkedList {
    /**
     * 头
     */
    head: LinkNode = null;
    /**
     * 链表长度
     */
    length: number = 0;

    constructor () {
        this.head = null;
        this.length = 0;
    }

    /**
     * 向链表尾部添加一个新的项
     * @param element
     */
    append (element: any) {
        const node = new LinkNode(element);
        if (this.head === null) {
            this.head = node;
            node.next = this.head;
        } else {
            let curNode = this.head;

            while (curNode.next !== this.head) {
                curNode = curNode.next;
            }

            curNode.next = node;
            node.next = this.head;
        }

        this.increaseLength();
    }

    /**
     * 链表是否为空
     * @returns {boolean}
     */
    isEmpty (): boolean {
        return this.length === 0;
    }

    /**
     * length自增
     */
    increaseLength () {
        this.length++;
    }

    /**
     * length自减
     */
    decreaseLength () {
        this.length--;
    }

    // /**
    //  * 显示链表元素
    //  */
    // display() {
    //     let curNode = this.head;

    //     while (curNode && curNode.next) {
    //         curNode = curNode.next;
    //     }
    // }
}