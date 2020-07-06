export class FIFOQueue<T> {
    protected first!: Node<T> | null;
    protected last!: Node<T> | null;
    add(val: T) {
        if (this.last) {
            this.last.next = this.last = new Node(val);
        } else {
            this.first = this.last = new Node(val);
        }
        return this;
    }

    flush(cb: (val: T) => any) {
        let cur = this.first;
        this.first = this.last = null;
        while (cur) {
            cb(cur.value);
            cur = cur.next;
        }
    }

    flushInteractive(cb: (val: T, next: () => boolean) => any) {
        let cur = this.first;
        this.first = this.last = null;
        process.nextTick(next);
        function next() {
            if (cur) {
                const val = cur.value;
                cur = cur.next;
                cb(val, next);
                return true;
            }

            return false;
        }
    }

    flushReduce<Acc>(cb: (acc: Acc, val: T) => Acc, acc: Acc): Acc {
        let cur = this.first;
        this.first = this.last = null;
        while (cur) {
            acc = cb(acc, cur.value);
            cur = cur.next;
        }
        return acc;
    }
}

export class FILOQueue<T> extends FIFOQueue<T>{
    add(val: T) {
        if (this.first) {
            this.first.next = this.first = new Node(val);
        } else {
            this.first = new Node(val);
        }
        return this;
    }
}

(FIFOQueue as any).prototype.first = null;
(FIFOQueue as any).prototype.last = null;

export class Node<T>{
    next: Node<T> | null;
    value: T;
    constructor(val: T) {
        this.value = val;
        this.next = null;
    }
}