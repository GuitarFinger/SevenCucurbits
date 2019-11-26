// ================== 数据
export class DTip {
    /**
     * 父节点
     */
    parent: cc.Node;
    /**
     * 文本
     */
    text: string;

    constructor (parent: cc.Node, text: string) {
        this.parent = parent;
        this.text = text;
    }
}

// ================== 枚举

export enum EMsg {
    /**弹出提示 */
    SCREEN_TIPS = 'screen_tips',

    /**速度改变 */
    SPEED_CHANGE = 'speed_change',
}


// ================== 类型


// ================== 常量
