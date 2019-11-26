/**
 * @module 队列
 * @desc 将任务推入队列中, 调用去控制执行
 */

 export class Queue {
    /**
     * 事件列表
     */
    _queue: Function[] = [];
    /**
     * 控制开关
     */
    _isPaused: boolean = false;

    /**
     * 计数器
     */
    _count: number = 0;
    /**
     * 间隔执行时间
     */
    _interval: number = 1;

    /**
     * 
     * @param interval 间隔时间
     */
    constructor (interval:number = 1) {
        this._interval = interval;
        this.init();
    }

    /**
     * 初始化
     */
    init () {
        this._queue = [];
        this._isPaused = false;
        this._count = 0;
    }

    /**
     * 添加处理函数
     * @param fn 
     */
    push (fn: Function) {
        this._count++;
        this._queue.push(fn);
        this.run();
    }

    start () {
        this._isPaused = false;
    }

    /**
     * 暂停
     */
    pause () {
        this._isPaused = true;
    }

    /**
     * 运行
     */
    run () {
        if (this._isPaused || !this._queue.length) return;

        // 执行最先进入的方法
        this._queue.shift()();
        this._count--;
        // 重新执行
        !this._isPaused && this.resume();
    }

    /**
     * 重新开始 去检查队列里面是否还有需要执行的函数
     */
    resume () {
        this.pause();

        setTimeout(() => {
            this.start();
            this.run();
        }, this._interval)
    }

 }