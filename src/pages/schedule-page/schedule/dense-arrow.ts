class DenseArrow<T> {
    stack: T[];

    isDirectChild: (parent: T, child: T, ...args: any) => boolean;
    cmp: (a: T, b: T) => 1 | 0 | -1;
    onAddFuncs: Array<(element: T) => void>;
    onRemoveFuncs: Array<(element: T) => void>;

    constructor(isDirectChild: (parent: T, child: T, ...args: any) => boolean, compare: (a: T, b: T) => 1 | 0 | -1,
        onAddFuncs: Array<(element: T) => void>, onRemoveFuncs: Array<(element: T) => void>) {
            this.stack = [];

            this.isDirectChild = isDirectChild;
            this.cmp = compare;
            this.onAddFuncs = onAddFuncs;
            this.onRemoveFuncs = onRemoveFuncs;
        }

    /**Returns true if item was toggled othrwise false */
    toggle(element: T) {
        const last = this.stack[this.stack.length - 1];
        
        if (!this.stack.length) {
            this.stack.push(element);
            this.runAddFuncs(element);
            return true;
        }
        
        if (this.has(element)) {
            for (let i = this.stack.length - 1; i > -1; i--) {
                const tail = this.stack.pop() as T;
                if (element === tail) {
                    this.runRemoveFuncs(tail)
                    break;
                } else {
                    this.runRemoveFuncs(tail);
                }

            }
            return true;
        }
        
        if (!this.has(element) && this.isDirectChild(last, element)) {
            this.stack.push(element);
            this.runAddFuncs(element);
            return true;
        }
        return false;
    }

    has(element: T): boolean {
        const first = this.stack[0];
        const last = this.stack[this.stack.length - 1];
        if ((this.cmp(first, element) >= 0 && this.cmp(element, last) >= 0) ||
            (this.cmp(first, element) <= 0 && this.cmp(element, last) <= 0)) 
        {
            return true;
        } else {
            return false;
        }
    }

    runAddFuncs(element: T) {
        for (const f of this.onAddFuncs) {
            f(element);
        }
    }

    runRemoveFuncs(element: T) {
        for (const f of this.onRemoveFuncs) {
            f(element);
        }   
    }

    copy(): DenseArrow<T> {
        let ad = new DenseArrow(this.isDirectChild, this.cmp, this.onAddFuncs, this.onRemoveFuncs);
        this.stack.forEach(v => ad.stack.push(v));
        return ad;
    }

    get length(): number {
        return this.stack.length;
    }

    clear() {
        this.stack = [];
        return this;
    }
}

export default DenseArrow;
